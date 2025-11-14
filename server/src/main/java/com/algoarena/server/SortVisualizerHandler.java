package com.algoarena.server;

import org.springframework.stereotype.Component; // New
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List; // New
import java.util.Map; // New
import java.util.stream.Collectors; // New

@Component // 1. Make this a Spring-managed component
public class SortVisualizerHandler extends TextWebSocketHandler {

    private final Map<String, SortingAlgorithm> algorithmMap;

    // 2. Inject all our algorithms, just like in SortController
    public SortVisualizerHandler(List<SortingAlgorithm> allAlgorithms) {
        this.algorithmMap = allAlgorithms.stream()
                .collect(Collectors.toMap(SortingAlgorithm::getName, algo -> algo));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New WebSocket connection established: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);

        // For now, we'll hard-code this for testing.
        // TODO: Parse 'payload' to get the real array and algo list.

        int[] testArray = {64, 34, 25, 12, 22, 11, 90};
        SortingAlgorithm algo = algorithmMap.get("Bubble Sort");

        if (algo != null) {
            // 3. CALL OUR NEW METHOD!
            // This will start the sort and stream updates to the client.
            algo.visualizeSort(testArray, session);
        }
    }
}