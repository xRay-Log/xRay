use axum::{
    extract::State,
    response::Json as AxumJson,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json;
use std::net::SocketAddr;
use tauri::Emitter;
use tauri::{async_runtime, AppHandle};
use tower_http::cors::{Any, CorsLayer};

// Main function to start Tauri and HTTP server
#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_handle = app.handle().clone(); // Clone the app handle for async task
            async_runtime::spawn(async move {
                start_http_server(app_handle).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Start HTTP server
async fn start_http_server(app_handle: tauri::AppHandle) {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/receive", post(receive_payload))
        .layer(cors)
        .with_state(app_handle);

    let addr = SocketAddr::from(([127, 0, 0, 1], 44827));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// Health check endpoint
async fn health_check() -> &'static str {
    "OK"
}

// Data model for /receive endpoint
#[derive(Serialize, Deserialize)]
struct Payload {
    project: String,
    level: String,
    payload: String,
    trace: String,
}

// Receive endpoint with Tauri event emit
async fn receive_payload(
    State(app_handle): State<AppHandle>,
    AxumJson(input): AxumJson<Payload>,
) -> AxumJson<String> {
    let input_string = match serde_json::to_string(&input) {
        Ok(json) => json,
        Err(e) => {
            eprintln!("Failed to serialize input to JSON: {}", e);
            return AxumJson("Failed to process payload".to_string());
        }
    };

    if let Err(e) = app_handle.emit("log", &input_string) {
        eprintln!("Failed to emit event: {}", e);
    }

    AxumJson("Data received!".to_string())
}
