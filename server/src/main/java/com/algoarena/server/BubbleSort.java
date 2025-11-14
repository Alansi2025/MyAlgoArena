package com.algoarena.server;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Service
public class BubbleSort implements SortingAlgorithm {

    @Override
    public String getName() {
        return "Bubble Sort";
    }

    @Override
    public SortReport sort(int[] array) {
        int[] arr = array.clone();
        int n = arr.length;

        long comparisons = 0;
        long swaps = 0;
        long startTime = System.nanoTime();

        for (int i = 0; i < n - 1; i++) {
            boolean didSwap = false;
            for (int j = 0; j < n - i - 1; j++) {
                comparisons++;
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swaps++;
                    didSwap = true;
                }
            }
            if (!didSwap) {
                break;
            }
        }

        long endTime = System.nanoTime();
        double durationMillis = (endTime - startTime) / 1_000_000.0;

        return new SortReport(this.getName(), n, durationMillis, comparisons, swaps);
    }

    @Override
    public void visualizeSort(int[] array, WebSocketSession session) {
        int[] arr = array.clone();
        int n = arr.length;

        try {
            for (int i = 0; i < n - 1; i++) {
                boolean didSwap = false;
                for (int j = 0; j < n - i - 1; j++) {
                    sendSocketMessage(session, "compare", j, j + 1);
                    if (arr[j] > arr[j + 1]) {
                        sendSocketMessage(session, "swap", j, j + 1);
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        didSwap = true;
                    }
                }
                if (!didSwap) {
                    break;
                }
            }
            sendSocketMessage(session, "done", -1, -1);
        } catch (IOException e) {
            System.err.println("Socket connection closed: " + e.getMessage());
        }
    }

    private void sendSocketMessage(WebSocketSession session, String type, int index1, int index2) throws IOException {
        if (session.isOpen()) {
            String jsonMessage = String.format(
                    "{\"type\": \"%s\", \"indices\": [%d, %d]}",
                    type, index1, index2
            );
            session.sendMessage(new TextMessage(jsonMessage));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}