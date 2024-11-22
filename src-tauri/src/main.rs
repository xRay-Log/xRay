use axum::{
    extract::Json, 
    routing::{get, post},
    Router,
    response::Json as AxumJson,
    extract::State
};
use serde::{Deserialize};
use std::net::SocketAddr;
use tauri::{async_runtime, AppHandle};
use tower_http::cors::{CorsLayer, Any};
use tauri::Emitter;

// Main function to start Tauri and HTTP server
#[tokio::main]
async fn main() {
    tauri::Builder::default()
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
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// Health check endpoint
async fn health_check() -> &'static str {
    "OK"
}

// Data model for /receive endpoint
#[derive(Debug, Deserialize)]
struct Payload {
    project: String,
    level: String,
    payload: String,
    trace: String,
}

// Receive endpoint with Tauri event emit
async fn receive_payload(
    State(app_handle): State<AppHandle>,
    Json(input): Json<Payload>
) -> AxumJson<String> {
    
    let input_string = format!(
        "{{\"project\":\"{}\",\"level\":\"{}\",\"payload\":\"{}\",\"trace\":\"{}\"}}",
        input.project,input.level,  input.payload, input.trace
    );

    if let Err(e) = app_handle.emit("log", &input_string) {
        eprintln!("Failed to emit event: {}", e);
    }
    //println!(String(app_handle));

    AxumJson("Data received!".to_string())
}
