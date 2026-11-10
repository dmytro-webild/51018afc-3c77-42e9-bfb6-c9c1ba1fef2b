import HeroColumnGrid from "@/components/sections/hero/HeroColumnGrid";
import AboutIntroStatement from "@/components/sections/about/AboutIntroStatement";
import ServicesIndustryTiles from "@/components/sections/features/ServicesIndustryTiles";
import PricingGlyphPlans from "@/components/sections/pricing/PricingGlyphPlans";
import TestimonialDeepCoverflow from "@/components/sections/testimonial/TestimonialDeepCoverflow";
import FaqGlyphRows from "@/components/sections/faq/FaqGlyphRows";
import ContactColumnWindow from "@/components/sections/contact/ContactColumnWindow";
import LoaderHairlineColumns from "@/components/loaders/LoaderHairlineColumns";

export default function HomePage() {
  return (
    <>
      <LoaderHairlineColumns
        brand="©Solvar"
      />

      <div id="hero" data-webild-section="HeroColumnGrid" data-webild-section-id="HeroColumnGrid-1" data-section="hero" data-scene>
        <HeroColumnGrid
          title="Profesjonelt renhold for hjem og bedrift i Oslo"
          description="Vi tilbyr grundig rengjøring til fastpris for private boliger, kontorer og Airbnb i hele Oslo."
          primaryButton={{
            text: "Bestill vask",
            href: "https://bestpris.no"
          }}
          imageSrc="https://img.b2bpic.net/free-photo/man-servant-cleaning-house_23-2149530803.jpg"
          imageAlt="man cleaning a modern home kitchen"
          introDelay={1.7}
        />
      </div>

      <div id="about" data-webild-section="AboutIntroStatement" data-webild-section-id="AboutIntroStatement-1" data-section="about">
        <AboutIntroStatement
          label="Renholdsbyrå Oslo"
          title="Vi tar vasken i private hjem, kontorer og Airbnb-boliger i Oslo. Du får forutsigbare faste priser og et skinnende rent resultat hver eneste gang."
          button={{
            text: "Se våre tjenester",
            href: "#services"
          }}
          imageSrc="https://img.b2bpic.net/free-photo/young-woman-rubber-gloves-holding-sponge-bottle-with-cleaning-supplies-looking-surprised-sitting-table-with-cleaning-supplies-tools-light-living-room_141793-98976.jpg"
          imageAlt="woman with cleaning supplies"
        />
      </div>

      <div id="services" data-webild-section="ServicesIndustryTiles" data-webild-section-id="ServicesIndustryTiles-1" data-section="services">
        <ServicesIndustryTiles
          title="Renhold tilpasset din hverdag"
          linkText="Bestill nå"
          items={[
            {
              title: "Regelmessig renhold",
              description: "Fast vaskehjelp med faste intervaller for ditt hjem.",
              facts: [
                "Faste intervaller hver uke",
                "Fast renholder til avtalt tid",
                "Standard utstyr er inkludert"
              ],
              imageSrc: "https://img.b2bpic.net/free-photo/mother-daughter-cleaning-kitchen-together_23-2148396122.jpg",
              imageAlt: "child and woman cleaning kitchen",
              href: "#contact"
            },
            {
              title: "Dyprengjøring",
              description: "Grundig hovedrengjøring som går helt i dybden.",
              facts: [
                "Rengjøring bak hvitevarer",
                "Grundig vask av skap og skuffer",
                "Perfekt til hovedrengjøring"
              ],
              imageSrc: "https://img.b2bpic.net/free-photo/woman-cleaning-kitchen-worktop_1170-2614.jpg",
              imageAlt: "Woman cleaning kitchen worktop",
              href: "#contact"
            },
            {
              title: "Flyttevask",
              description: "Komplett rengjøring ved inn- og utflytting.",
              facts: [
                "Overtakelsesgaranti inkludert",
                "Vask av vinduer og karmer",
                "Godkjent for boligsalg"
              ],
              imageSrc: "https://img.b2bpic.net/free-photo/front-view-woman-cleaning-home_23-2150453300.jpg",
              imageAlt: "Front view woman cleaning home",
              href: "#contact"
            },
            {
              title: "Oppussingsvask",
              description: "Effektiv fjerning av byggestøv og skitt etter renovering.",
              facts: [
                "Fjerner fint byggestøv",
                "Fjerner malingsrester trygt",
                "Klar for ny innflytting"
              ],
              imageSrc: "https://img.b2bpic.net/free-photo/medium-shot-construction-worker-ladder_23-2149366649.jpg",
              imageAlt: "Medium shot construction worker on ladder",
              href: "#contact"
            }
          ]}
        />
      </div>

      <div id="pricing" data-webild-section="PricingGlyphPlans" data-webild-section-id="PricingGlyphPlans-1" data-section="pricing">
        <PricingGlyphPlans
          label="Fastpris"
          title="Klar pris uten overraskelser"
          description="Bestill fast vaskehjelp med faste intervaller eller be om et skreddersydd tilbud til bedriften."
          items={[
            {
              title: "Privat vaskehjelp",
              price: "fra 590,-",
              description: "For regelmessig vask i private hjem.",
              features: [
                "Miljøvennlige såper og utstyr",
                "Grundig støvtørk og støvsuging",
                "Vask av gulv, kjøkken, bad",
                "Faste intervaller etter ønske"
              ],
              button: {
                text: "Bestill vask",
                href: "https://bestpris.no"
              }
            },
            {
              title: "Bedriftsvask",
              price: "fra 690,-",
              description: "Fast renhold for kontor og næringslokaler.",
              features: [
                "Vinduspuss og tepperens",
                "Påfyll av forbruksmateriell",
                "Fleksibel tidsplan før åpning",
                "Tilpasset avtale for næring"
              ],
              button: {
                text: "Få tilbud",
                href: "#contact"
              }
            },
            {
              title: "Flytte & dypvask",
              price: "fra 590,-",
              description: "Grundig hovedrengjøring og flyttevask.",
              features: [
                "Gjennomgang av hele boligen",
                "Fjerning av byggestøv og skitt",
                "Vask av skap og flater",
                "Garanti for overlevering"
              ],
              button: {
                text: "Bestill vask",
                href: "https://bestpris.no"
              }
            }
          ]}
        />
      </div>

      <div id="testimonial" data-webild-section="TestimonialDeepCoverflow" data-webild-section-id="TestimonialDeepCoverflow-1" data-section="testimonial">
        <TestimonialDeepCoverflow
          title="Hva våre kunder sier"
          description="Les tilbakemeldinger fra private boligeiere og bedrifter i Oslo."
          items={[
            {
              name: "Ingrid L.",
              role: "Privatkunde, Frogner",
              quote: "Veldig fornøyd med fast vaskehjelp. De møter alltid presist og leiligheten er skinnende ren hver gang.",
              imageSrc: "https://img.b2bpic.net/free-photo/beautiful-woman-cafe_273609-12706.jpg",
              imageAlt: "Beautiful woman at a cafe"
            },
            {
              name: "Thomas K.",
              role: "Airbnb-utleier, Majorstuen",
              quote: "Utmerket vask mellom gjester. Faste priser og god service gjør det veldig enkelt for oss.",
              imageSrc: "https://img.b2bpic.net/free-photo/smiling-young-man-standing-kitchen-throwing-whole-cabbage-air_23-2148075952.jpg",
              imageAlt: "Smiling young man standing in the kitchen throwing whole cabbage in air"
            },
            {
              name: "Camilla M.",
              role: "Boligeier, Nordstrand",
              quote: "Flyttevasken var grundig utført. Boligen ble godkjent av ny eier uten anmerkninger.",
              imageSrc: "https://img.b2bpic.net/free-photo/portrait-happy-woman-home_1398-4980.jpg",
              imageAlt: "Portrait of happy woman at home"
            },
            {
              name: "Jonas S.",
              role: "Daglig leder, Sentrum",
              quote: "Kontoret er alltid rent til morgenen. Pålitelige renholdere og ryddig avtale.",
              imageSrc: "https://img.b2bpic.net/free-photo/portrait-young-businessman-working_23-2148908893.jpg",
              imageAlt: "Portrait young businessman working"
            },
            {
              name: "Marianne H.",
              role: "Huseier, Ullern",
              quote: "Grundig hovedvask før sommeren. Renholdet var top notch til avtalt fastpris.",
              imageSrc: "https://img.b2bpic.net/free-photo/leisure-wellbeing-concept-gorgeous-smiling-woman-sit-rattan-so_197531-22179.jpg",
              imageAlt: "Leisure, wellbeing concept. Gorgeous smiling woman sit rattan so"
            }
          ]}
        />
      </div>

      <div id="faq" data-webild-section="FaqGlyphRows" data-webild-section-id="FaqGlyphRows-1" data-section="faq">
        <FaqGlyphRows
          label="Ofte spurt"
          title="Det du praktisk må vite"
          description="Svar på vanlige spørsmål om bestilling, avtaler og utstyr for renhold i Oslo."
          button={{
            text: "Kontakt oss",
            href: "#contact"
          }}
          items={[
            {
              title: "Hvordan booker jeg renhold hos dere?",
              description: "Du kan bestille tjenester direkte via bestpris.no eller ta kontakt med oss på nettsiden. Vi setter opp en fast avtale eller engangsvask etter ditt ønske."
            },
            {
              title: "Er det noen bindingstid på renholdsavtalen?",
              description: "Nei, vi tilbyr fleksible renholdsavtaler uten lang bindingstid. Du kan enkelt endre eller avbestille etter dine behov."
            },
            {
              title: "Tar renholderne med eget utstyr og vaskemidler?",
              description: "Ja, våre renholdere tar med alt nødvendig utstyr og miljøvennlige rengjøringsprodukter til oppdraget i Oslo."
            },
            {
              title: "Hva koster vanlig vaskehjelp i Oslo?",
              description: "Vi tilbyr regelmessig renhold fra 590,- og grundig dyprengjøring fra 690,- med faste forutsigbare priser."
            },
            {
              title: "Tilbyr dere også flyttevask og byggvask?",
              description: "Ja, vi utfører flyttevask for boliger samt grundig bygg- og oppussingsvask som fjerner byggstøv og malingsrester."
            },
            {
              title: "Hva skjer dersom jeg må endre vasketidspunktet?",
              description: "Gi oss beskjed i god tid før avtalt tidspunkt, så finner vi et nytt tidspunkt som passer bedre for deg."
            }
          ]}
        />
      </div>

      <div id="contact" data-webild-section="ContactColumnWindow" data-webild-section-id="ContactColumnWindow-1" data-section="contact">
        <ContactColumnWindow
          title="Bestill renhold i Oslo"
          submitText="Send melding"
          successText="Takk! Vi svarer deg innen 24 timer."
          images={[
            {
              imageSrc: "https://img.b2bpic.net/free-photo/smiling-young-housekeeper-wiping-white-table-with-cloth-home_23-2148222249.jpg",
              imageAlt: "Smiling young housekeeper wiping white table with cloth at home"
            },
            {
              imageSrc: "https://img.b2bpic.net/free-photo/full-shot-people-cleaning-office_23-2150454486.jpg",
              imageAlt: "Full shot people cleaning office"
            },
            {
              imageSrc: "https://img.b2bpic.net/free-photo/portrait-young-smiling-woman-wearing-rubber-gloves-cleaning_1163-2431.jpg",
              imageAlt: "Portrait of a young smiling woman wearing rubber gloves cleaning"
            }
          ]}
        />
      </div>
    </>
  );
}
