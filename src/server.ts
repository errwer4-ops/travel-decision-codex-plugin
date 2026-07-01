import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { estimateTripCost } from "./lib/calculateCosts.js";
import { calculateBookingConfidence } from "./lib/confidenceScore.js";
import { planBookableTrip } from "./lib/planGenerator.js";
import type {
  BookableTripInput,
  EstimateTripCostInput,
  ExplainBookingConfidenceInput
} from "./types/travel.js";

type JsonRpcRequest = {
  jsonrpc?: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

const tools = [
  {
    name: "plan_bookable_trip",
    description: "Create three bookable travel plan options and evaluate booking confidence.",
    inputSchema: {
      type: "object",
      properties: {
        departureDate: { type: "string", description: "YYYY-MM-DD" },
        returnDate: { type: "string", description: "YYYY-MM-DD" },
        departureAirport: { type: "string" },
        arrivalAirport: { type: "string" },
        travelers: { type: "number" },
        budgetKRW: { type: "number" },
        mustVisitAttractions: { type: "array", items: { type: "string" } },
        travelStyle: { type: "string", enum: ["budget", "balanced", "premium"] },
        directFlightPreferred: { type: "boolean" },
        preferredHotelArea: { type: "string" }
      },
      required: [
        "departureDate",
        "returnDate",
        "departureAirport",
        "arrivalAirport",
        "travelers",
        "budgetKRW",
        "mustVisitAttractions"
      ]
    }
  },
  {
    name: "estimate_trip_cost",
    description: "Estimate total trip cost with fuel surcharge, hidden costs, and budget status.",
    inputSchema: {
      type: "object",
      properties: {
        departureDate: { type: "string" },
        returnDate: { type: "string" },
        departureAirport: { type: "string" },
        arrivalAirport: { type: "string" },
        travelers: { type: "number" },
        budgetKRW: { type: "number" },
        mustVisitAttractions: { type: "array", items: { type: "string" } },
        travelStyle: { type: "string", enum: ["budget", "balanced", "premium"] }
      },
      required: [
        "departureDate",
        "returnDate",
        "departureAirport",
        "arrivalAirport",
        "travelers",
        "budgetKRW",
        "mustVisitAttractions",
        "travelStyle"
      ]
    }
  },
  {
    name: "explain_booking_confidence",
    description: "Explain a booking confidence score and suggest improvements.",
    inputSchema: {
      type: "object",
      properties: {
        totalCostKRW: { type: "number" },
        budgetKRW: { type: "number" },
        mustVisitCoverageRate: { type: "number" },
        routeEfficiencyScore: { type: "number" },
        hiddenCostIncluded: { type: "boolean" },
        fuelSurchargeIncluded: { type: "boolean" },
        travelStyle: { type: "string", enum: ["budget", "balanced", "premium"] }
      },
      required: [
        "totalCostKRW",
        "budgetKRW",
        "mustVisitCoverageRate",
        "routeEfficiencyScore",
        "hiddenCostIncluded",
        "fuelSurchargeIncluded",
        "travelStyle"
      ]
    }
  }
];

function respond(id: JsonRpcRequest["id"], result: unknown): void {
  output.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function respondError(id: JsonRpcRequest["id"], error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  output.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message } })}\n`);
}

function toolResult(data: unknown) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2)
      }
    ]
  };
}

async function handleRequest(request: JsonRpcRequest): Promise<void> {
  if (request.method === "initialize") {
    respond(request.id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: "travel-decision",
        version: "0.1.0"
      }
    });
    return;
  }

  if (request.method === "tools/list") {
    respond(request.id, { tools });
    return;
  }

  if (request.method === "tools/call") {
    const name = request.params?.name;
    const args = (request.params?.arguments ?? {}) as Record<string, unknown>;

    if (name === "plan_bookable_trip") {
      respond(request.id, toolResult(planBookableTrip(args as unknown as BookableTripInput)));
      return;
    }

    if (name === "estimate_trip_cost") {
      respond(request.id, toolResult(estimateTripCost(args as unknown as EstimateTripCostInput)));
      return;
    }

    if (name === "explain_booking_confidence") {
      respond(request.id, toolResult(calculateBookingConfidence(args as unknown as ExplainBookingConfidenceInput)));
      return;
    }

    throw new Error(`Unknown tool: ${String(name)}`);
  }

  if (request.id !== undefined) {
    respond(request.id, {});
  }
}

const rl = readline.createInterface({ input });

rl.on("line", async (line) => {
  if (!line.trim()) return;

  let request: JsonRpcRequest | null = null;
  try {
    request = JSON.parse(line) as JsonRpcRequest;
    await handleRequest(request);
  } catch (error) {
    respondError(request?.id ?? null, error);
  }
});
