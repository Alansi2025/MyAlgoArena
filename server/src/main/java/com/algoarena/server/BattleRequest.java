package com.algoarena.server;

import java.util.List;

/**
 * This class maps to the JSON request our frontend will send.
 * Jackson (the JSON library) will automatically create this object for us.
 */
public class BattleRequest {

    private List<String> algorithms;
    private int arraySize;
    private String arrayType;

    // --- Getters ---
    // Needed by Jackson to read the data
    public List<String> getAlgorithms() {
        return algorithms;
    }

    public int getArraySize() {
        return arraySize;
    }

    public String getArrayType() {
        return arrayType;
    }

    // --- Setters ---
    // Needed by Jackson to write the data
    public void setAlgorithms(List<String> algorithms) {
        this.algorithms = algorithms;
    }

    public void setArraySize(int arraySize) {
        this.arraySize = arraySize;
    }

    public void setArrayType(String arrayType) {
        this.arrayType = arrayType;
    }
}