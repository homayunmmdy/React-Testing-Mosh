import { http, HttpResponse, delay } from "msw";
import { server } from "./mocks/server";

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateEror = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};
