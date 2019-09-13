use pulldown_cmark::{html, Options, Parser};
use regex::Regex;
use serde::{Deserialize, Serialize};
use slug::slugify;

use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::{Path, PathBuf};

fn get_file_paths(dir: &Path) -> Vec<PathBuf> {
  let paths = fs::read_dir(dir)
    .unwrap()
    .filter_map(|entry| entry.ok())
    .map(|entry| entry.path())
    .collect::<Vec<PathBuf>>();
  return paths;
}

fn get_file_contents(path: &PathBuf) -> String {
  fs::read_to_string(path).unwrap()
}

#[derive(Serialize, Deserialize)]
struct Frontmatter {
  title: String,
  excerpt: String,
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
    return (fm, stripped_md);
  }

  fn find_frontmatter(&self, markdown: &str) -> String {
    let captures = self.pattern.captures(markdown).unwrap();
    return captures.get(1).unwrap().as_str().to_owned();
  }

  fn strip_frontmatter(&self, markdown: &str) -> String {
    return self.pattern.replace(markdown, "").to_string();
  }

  fn json_to_frontmatter(&self, fm_json: &str) -> Frontmatter {
    let fm: Frontmatter = serde_json::from_str(&fm_json).unwrap();
    return fm;
  }
}

#[derive(Serialize, Deserialize)]
struct Post {
  title: String,
  slug: String,
  date: String,
  excerpt: String,
  html: String,
}

impl Post {
  pub fn new(fm: &Frontmatter, html: String) -> Self {
    Post {
      title: fm.title.to_owned(),
      slug: slugify(fm.title.to_owned()),
      date: fm.date.to_owned(),
      excerpt: fm.excerpt.to_owned(),
      html,
    }
  }
}

fn main() {
  let fm_parser = FrontmatterParser::new();
  let files = get_file_paths(Path::new("./src/posts"));

  let posts = files
    .iter()
    .map(|file| {
      let contents = get_file_contents(file);
      let (fm, markdown) = fm_parser.parse(&contents);
      let md_parser = Parser::new(&markdown);
      let mut html = String::new();
      html::push_html(&mut html, md_parser);
      return Post::new(&fm, html);
    })
    .collect::<Vec<Post>>();

  for post in posts.iter() {
    let json = serde_json::to_string(&post).unwrap();
    let path = format!("./dist/{}.json", post.slug);
    let mut file = File::create(Path::new(&path)).unwrap();
    file.write_all(json.as_bytes()).unwrap();
  }
}

// fn main() -> std::io::Result<()> {
//   let file = Path::new("./src/posts/post-1.md");
//   let mut contents = fs::read_to_string(file).unwrap();

//   let mut options = Options::empty();
//   options.insert(Options::ENABLE_STRIKETHROUGH);

//   let parser = Parser::new_ext(&mut contents, options);

//   let mut html = String::new();
//   html::push_html(&mut html, parser);

//   let post = Post {
//     title: String::from("lol post"),
//     excerpt: String::new(),
//     content: html,
//   };

//   let json = serde_json::to_string(&post)?;

//   let post_path = Path::new("./dist/post-1.json");
//   let mut post_file = File::create(post_path).unwrap();
//   post_file.write_all(json.as_bytes())?;
//   Ok(())
// }
