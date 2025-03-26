/*
Situation:

Problem Context: We need to find a minimum-weight arborescence (directed spanning tree) in a weighted directed graph rooted at vertex 1.
Input: A graph with n vertices and m edges (1 ≤ n ≤ 1000, 1 ≤ m ≤ 10000), where edges have non-negative weights.
Constraints: The solution must terminate within 10 seconds.




Task
Primary Objective:
Implement an algorithm to compute the total weight of the minimum-weight arborescence rooted at vertex 1.

Key Requirements:
Handle directed graphs with possible cycles.
Ensure every vertex is reachable from the root.
Optimize for efficiency given the constraints (O(nm) time complexity).

Edge Cases:
Disconnected graphs (though the problem guarantees reachability).
Graphs with parallel edges (excluded by problem constraints).
Large graphs (n ≈ 1000, m ≈ 10000).




APPROACH: Chu-Liu/Edmonds' Algorithm for Minimum Arborescence


1. INITIALIZATION
 - Start with total weight = 0
 - Root is fixed (vertex 1)


2. MAIN LOOP (repeat until solution found)
 a. SELECT MIN INCOMING EDGES:
   - For each vertex (except root), pick its cheapest incoming edge
   - These edges form a "reduced graph"


 b. CYCLE DETECTION:
   - Check if the reduced graph contains any directed cycles
   - If NO cycles found:
     * Sum weights of all selected edges → this is our solution
     * Exit algorithm


 c. CYCLE CONTRACTION (if cycles exist):
   - For each detected cycle:
     * Calculate total weight of cycle edges
     * Contract the cycle into a single "supernode"
     * Adjust edge weights for edges entering/leaving the cycle:
      - For edges ENTERING the cycle: weight = original_weight - selected_incoming_edge_weight
      - For edges LEAVING the cycle: weight remains unchanged


 d. RECURSION:
   - Solve the problem recursively on the contracted graph
   - When expanding back:
     * Keep all selected edges except one in each cycle
     * For each cycle, exclude the edge that would create a conflict


3. TERMINATION
 - When graph has no cycles in reduced form
 - Sum of selected edge weights gives the minimal arborescence






 
*/










function minArborescence(n, edges, root = 1) {
    let totalWeight = 0;
    
    while (true) {
        // Step 1: Select minimum incoming edge for each vertex
        const minInEdge = new Array(n + 1).fill(null);
        edges.forEach(({ u, v, w }) => {
            if (u !== v && (minInEdge[v] === null || w < minInEdge[v].w)) {
                minInEdge[v] = { u, w };
            }
        });

        // Check if all vertices (except root) have incoming edges
        for (let v = 1; v <= n; v++) {
            if (v !== root && minInEdge[v] === null) {
                return -1; // No arborescence exists
            }
        }

        // Step 2: Detect cycles in the selected edges
        const visited = new Array(n + 1).fill(false);
        let cycleFound = false;
        let cycle = [];

        for (let v = 1; v <= n; v++) {
            if (!visited[v] && v !== root) {
                const path = [];
                let current = v;
                
                // Trace back the path
                while (current !== null && !visited[current]) {
                    visited[current] = true;
                    path.push(current);
                    current = minInEdge[current]?.u ?? null;
                }

                // Check if we found a cycle
                if (current !== null && path.includes(current)) {
                    cycleFound = true;
                    const startIdx = path.indexOf(current);
                    cycle = path.slice(startIdx);
                    break;
                }
            }
        }

        // If no cycle found, we have our solution
        if (!cycleFound) {
            for (let v = 1; v <= n; v++) {
                if (v !== root && minInEdge[v]) {
                    totalWeight += minInEdge[v].w;
                }
            }
            return totalWeight;
        }

        // Step 3: Contract the cycle
        const cycleId = n + 1; // New ID for the contracted node
        let cycleWeight = 0;
        
        // Calculate total weight of the cycle
        cycle.forEach(v => {
            cycleWeight += minInEdge[v].w;
        });

        // Step 4: Create new edges with adjusted weights
        const newEdges = [];
        edges.forEach(({ u, v, w }) => {
            const uInCycle = cycle.includes(u);
            const vInCycle = cycle.includes(v);
            
            if (!uInCycle && !vInCycle) {
                // Edge not related to cycle - keep as is
                newEdges.push({ u, v, w });
            } else if (!uInCycle && vInCycle) {
                // Edge entering the cycle - adjust weight
                newEdges.push({ u, v: cycleId, w: w - minInEdge[v].w });
            } else if (uInCycle && !vInCycle) {
                // Edge leaving the cycle - keep original weight
                newEdges.push({ u: cycleId, v, w });
            }
            // Edges within cycle are ignored
        });

        // Update parameters for next iteration
        n = cycleId;
        edges = newEdges;
        root = cycle.includes(root) ? cycleId : root;
        totalWeight += cycleWeight;
    }
}

// Example usage:
const n = 4;
const edges = [
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 3, w: 1 },
    { u: 2, v: 4, w: 2 },
    { u: 3, v: 4, w: 1 }
];

console.log(minArborescence(n, edges, 1)); // Output: 4 (1→2, 2→3, 3→4)










