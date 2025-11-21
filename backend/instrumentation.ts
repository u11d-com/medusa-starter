import { registerOtel } from "@medusajs/medusa"
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin"

// If using an exporter other than Zipkin, initialize it here.
const exporter = new ZipkinExporter({
  serviceName: "my-medusa-project",
})

export function register() {
  registerOtel({
    serviceName: "medusajs",
    // pass exporter
    exporter,
    instrument: {
      http: true,
      workflows: true,
      query: true,
      db: true
    },
  })
}
