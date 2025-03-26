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