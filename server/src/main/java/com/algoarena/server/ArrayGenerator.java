package com.algoarena.server;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class ArrayGenerator {

    private final Random random = new Random();

    public int[] generate(int size, String type) {
        int[] arr = new int[size];

        switch (type.toLowerCase()) {
            case "sorted":
                for (int i = 0; i < size; i++) {
                    arr[i] = i;
                }
                break;

            case "reversed":
                for (int i = 0; i < size; i++) {
                    arr[i] = size - 1 - i;
                }
                break;

            case "random":
            default:
                // Generate random numbers between 0 and size*10
                for (int i = 0; i < size; i++) {
                    arr[i] = random.nextInt(size * 10);
                }
                break;
        }
        return arr;
    }
}