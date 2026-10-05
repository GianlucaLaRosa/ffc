/**
 * Historical demo seed for the previous backoffice schema.
 * It is not compatible with FCR collections (conference-days, drafts, appendices, …).
 *
 * Reference data (countries, italian-regions, abstract-statuses, footer policies) is seeded in Payload onInit.
 * Create editions, days, agenda, people, and appendix content in /admin.
 */
console.error(
  'src/seed is disabled after the FCR CMS merge. Use /admin; lookup tables seed on first boot.',
)
process.exit(1)
