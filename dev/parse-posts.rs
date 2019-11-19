use pulldown_cmark::{html, Parser};
use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::{json, Map};
use slug::slugify;

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::{Path, PathBuf};

fn get_file_paths(dir: &Path) -> Vec<PathBuf> {
  fs::read_dir(dir)
    .expect(&format!("failed to read dir {}", dir.display()))
    .filter_map(|entry| entry.ok())
    .map(|entry| entry.path())
    .collect::<Vec<PathBuf>>()
}

fn get_file_contents(path: &PathBuf) -> String {
  fs::read_to_string(path).expect(&format!(
    "failed to read file contents from {}",
    path.display()
  ))
}

#[derive(Serialize, Deserialize)]
struct Frontmatter {
  title: String,
  summary: String,
  date: String,
}

struct FrontmatterParser {
  pattern: Regex,
}

impl FrontmatterParser {
  pub fn new() -> Self {
    FrontmatterParser {
      pattern: Regex::new(r"^\+{3}((?s).*?(?-s))\+{3}").unwrap(),
    }
  }

  pub fn parse(&self, markdown: &str) -> (Frontmatter, String) {
    let fm_json = self.find_frontmatter(markdown);
    let stripped_md = self.strip_frontmatter(markdown);
    let fm = self.json_to_frontmatter(&fm_json);
    (fm, stripped_md)
  }

  fn find_frontmatter(&self, markdown: &str) -> String {
    let captures = self.pattern.captures(markdown).unwrap();
    captures.get(1).unwrap().as_str().to_owned()
  }

  fn strip_frontmatter(&self, markdown: &str) -> String {
    self.pattern.replace(markdown, "").to_string()
  }

  fn json_to_frontmatter(&self, fm_json: &str) -> Frontmatter {
    serde_json::from_str(&fm_json).unwrap()
  }
}

#[derive(Serialize, Deserialize)]
struct Post {
  title: String,
  slug: String,
  date: String,
  summary: String,
  html: String,
}

impl Post {
  pub fn new(fm: &Frontmatter, html: String) -> Self {
    Post {
      title: fm.title.to_owned(),
      slug: slugify(fm.title.to_owned()),
      date: fm.date.to_owned(),
      summary: fm.summary.to_owned(),
      html,
    }
  }
}

fn main() {
  let fm_parser = FrontmatterParser::new();
  let files = get_file_paths(Path::new("src/posts"));

  let posts = files
    .iter()
    .map(|file| {
      let contents = get_file_contents(file);
      let (fm, markdown) = fm_parser.parse(&contents);
      let md_parser = Parser::new(&markdown);
      let mut html = String::new();
      html::push_html(&mut html, md_parser);
      Post::new(&fm, html)
    })
    .collect::<Vec<Post>>();

  // create recent posts json
  let mut recent_posts = Map::new();
  for post in posts.iter() {
    let key = &post.slug;
    let value = json!({
      "title": post.title,
      "summary": post.summary,
    });
    recent_posts.insert(key.to_string(), value);
  }

  let recent_posts_json = serde_json::to_string(&recent_posts).unwrap();
  let mut recent_posts_file = File::create(Path::new("dist/recent_posts.json"))
    .expect("failed to create recent posts json file");
  recent_posts_file
    .write_all(recent_posts_json.as_bytes())
    .expect("failed to write to recent posts json file");

  if !Path::new("./dist/posts").exists() {
    fs::create_dir("./dist/posts").expect("failed to create posts directory")
  }

  // create post json
  for post in posts.iter() {
    let json = serde_json::to_string(&post).unwrap();
    let path = format!("./dist/posts/{}.json", post.slug);
    let mut file =
      File::create(Path::new(&path)).expect(&format!("failed to create post file {}", path));
    file
      .write_all(json.as_bytes())
      .expect(&format!("failed to write to post file {}", path));
  }
}
