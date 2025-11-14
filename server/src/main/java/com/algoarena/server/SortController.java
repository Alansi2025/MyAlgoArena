package com.algoarena.server;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/battle") // All methods in this class start with /api/battle
public class SortController {

    private final ArrayGenerator arrayGenerator;
    private final Map<String, SortingAlgorithm> algorithmMap;

    /**
     * This is Dependency Injection.
     * Spring sees we need a List of all SortingAlgorithm implementations
     * and our ArrayGenerator. It provides them automatically.
     */
    public SortController(List<SortingAlgorithm> allAlgorithms, ArrayGenerator arrayGenerator) {
        this.arrayGenerator = arrayGenerator;

        // Convert the list of algorithms into a Map for easy lookup by name
        // e.g., "Bubble Sort" -> BubbleSort object
        this.algorithmMap = allAlgorithms.stream()
                .collect(Collectors.toMap(SortingAlgorithm::getName, algo -> algo));
    }

    /**
     * This method handles POST requests to /api/battle
     * It expects a JSON body that matches our BattleRequest class.
     */
    @PostMapping
    public BattleResult runBattle(@RequestBody BattleRequest request) {

        // 1. Generate the array for this battle
        int[] arrayToTest = arrayGenerator.generate(
                request.getArraySize(),
                request.getArrayType()
        );

        List<SortReport> reports = new ArrayList<>();

        // 2. Loop through the algorithm names sent from the frontend
        for (String algoName : request.getAlgorithms()) {

            // 3. Find the matching algorithm "fighter" from our Map
            SortingAlgorithm algorithm = algorithmMap.get(algoName);

            if (algorithm != null) {
                // 4. Run the sort and add the report to our list
                // The .sort() method clones the array, so the original is safe
                reports.add(algorithm.sort(arrayToTest));
            }
        }

        // 5. Spring automatically converts this List into a JSON array and sends it!
        return new BattleResult(request.getArrayType(), request.getArraySize(), reports);
    }
}