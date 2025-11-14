package com.algoarena.server;

// We need this for the new method
import org.springframework.web.socket.WebSocketSession;

/**
 * This is our "contract" for all sorting algorithms.
 */
public interface SortingAlgorithm {

    /**
     * @return The display name of the algorithm
     */
    String getName();

    /**
     * Runs a "silent" sort to generate a performance report.
     * @param array The array to sort.
     * @return A SortReport object with all the metrics.
     */
    SortReport sort(int[] array);

    /**
     * [NEW] Runs a "visual" sort, sending step-by-step updates
     * over a WebSocket connection.
     * * This is a 'default' method, so our other 7 classes
     * don't break. They just have an empty implementation.
     * * @param array The array to sort.
     * @param session The WebSocket session to send updates to.
     */
    default void visualizeSort(int[] array, WebSocketSession session) {
        // Default implementation does nothing.
        // We will @Override this in BubbleSort.
    }
}