package com.algoarena.server;

import org.springframework.beans.factory.annotation.Autowired; // New
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    // 1. Inject the handler component Spring just built
    @Autowired
    private SortVisualizerHandler sortVisualizerHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 2. Register the component instance instead of a "new" one
        registry.addHandler(sortVisualizerHandler, "/sort-visualizer");
    }
}