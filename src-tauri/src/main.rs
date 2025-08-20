#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Builder, async_runtime};
use reqwest::blocking::Client;
use directories::ProjectDirs;
use std::{fs, io::Write};

const MIN_ID: u32 = 28_000_000;
const MAX_ID: u32 = 28_001_000;

#[tauri::command]
fn get_profileicons_path() -> String {
    let proj = directories::ProjectDirs::from("com", "HyperCoderX", "BrawlTracker").unwrap();
    proj.data_dir().join("profileicons").to_string_lossy().to_string()
}

#[tauri::command]
fn update_icons_tauri() {
  let client = Client::new();
  let proj = ProjectDirs::from("com", "HyperCoderX", "BrawlTracker").unwrap();
  let icon_dir = proj.data_dir().join("profileicons");
  fs::create_dir_all(&icon_dir).unwrap();

  for id in MIN_ID..=MAX_ID {
    let out = icon_dir.join(format!("{id}.png"));
    if out.exists() { continue; }
    let url = format!("https://cdn.brawlify.com/profile-icons/regular/{id}.png");
    match client.head(&url).send() {
      Ok(head_resp) if head_resp.status().is_success() => {
        if let Ok(get_resp) = client.get(&url).send() {
          if let Ok(bytes) = get_resp.bytes() {
            let mut f = fs::File::create(&out).unwrap();
            f.write_all(&bytes).unwrap();
          }
        }
      }
      _ => { /* skip */ }
    }
  }
}

fn main() {
  Builder::default()
    .invoke_handler(tauri::generate_handler![update_icons_tauri, get_profileicons_path])
    .setup(|_app| {
      async_runtime::spawn_blocking(|| update_icons_tauri());
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
