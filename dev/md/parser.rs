use pulldown_cmark::{Parser, Options, html};
use serde::{Deserialize, Serialize};

use std::fs;
use std::fs::File;
use std::path::Path;
use std::io::prelude::*;

#[derive(Serialize, Deserialize)]
struct Post {
  title: String,
  content: String,
}

fn main() -> std::io::Result<()> {
  let file = Path::new("./src/posts/post-1.md");
  let mut contents = fs::read_to_string(file).unwrap();

  let mut options = Options::empty();
  options.insert(Options::ENABLE_STRIKETHROUGH);

  let parser = Parser::new_ext(&mut contents, options);

  let mut html = String::new();
  html::push_html(&mut html, parser);

  let post = Post {
    title: String::from("lol post"),
    content: html,
  };

  let json = serde_json::to_string(&post)?;

  let post_path = Path::new("./dist/post-1.json");
  let mut post_file = File::create(post_path).unwrap();
  post_file.write_all(json.as_bytes())?;
  Ok(())
}