import { Outlet } from "react-router-dom";
import NavbarBoxLinks from "@/components/navbars/NavbarBoxLinks";
import FooterLimeWordmark from "@/components/sections/footer/FooterLimeWordmark";

export default function Layout() {
  return (
    <div className="relative isolate min-h-svh flex flex-col bg-background text-foreground" data-button="default" data-card="default" data-pattern="none">
      <header data-webild-section="Header">
        <NavbarBoxLinks
          brand="Renhold Ekspert"
          navItems={[
            {
              name: "Tjenester",
              href: "#services"
            },
            {
              name: "Priser",
              href: "#pricing"
            },
            {
              name: "Om oss",
              href: "#about"
            },
            {
              name: "FAQ",
              href: "#faq"
            }
          ]}
          primaryButton={{
            text: "Bestill renhold",
            href: "#contact"
          }}
          introDelay={1.7}
        />
      </header>
      <main className="flex-grow" data-button="default" data-card="default" data-pattern="none">
        <Outlet />
      </main>
      <footer data-webild-section="Footer" data-section="footer">
        <FooterLimeWordmark
          description="Klar for et renere hjem eller kontor i Oslo? Bestill vask til fastpris direkte på nett eller kontakt oss for en uforpliktende prat."
          primaryButton={{
            text: "Bestill vask",
            href: "https://bestpris.no"
          }}
          columns={[
            {
              title: "Navigasjon",
              links: [
                {
                  text: "Hjem",
                  href: "#hero"
                },
                {
                  text: "Om oss",
                  href: "#about"
                },
                {
                  text: "Våre tjenester",
                  href: "#services"
                },
                {
                  text: "Priser",
                  href: "#pricing"
                },
                {
                  text: "Kundeomtaler",
                  href: "#testimonial"
                },
                {
                  text: "Spørsmål og svar",
                  href: "#faq"
                },
                {
                  text: "Kontakt oss",
                  href: "#contact"
                }
              ]
            },
            {
              title: "Renholdstjenester",
              links: [
                {
                  text: "Regelmessig renhold",
                  href: "#services"
                },
                {
                  text: "Dyprengjøring",
                  href: "#services"
                },
                {
                  text: "Flyttevask",
                  href: "#services"
                },
                {
                  text: "Bygg- og oppussingsvask",
                  href: "#services"
                },
                {
                  text: "Bestill på Bestpris.no",
                  href: "https://bestpris.no"
                }
              ]
            }
          ]}
          wordmark="Renhold Ekspert"
          city="Oslo"
          timeZone="Europe/Oslo"
          copyright="© 2026 Renhold Ekspert Oslo. Alle rettigheter reservert."
        />
      </footer>
    </div>
  );
}
