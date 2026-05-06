/* eslint-disable */
// Villa Cortese — Mobile app entry

const { useState, useEffect } = React;

function VillaCorteseAppMobile() {
  const [lang, setLang] = useState("it");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  window.useRevealMobile();

  const T = window;

  return (
    <>
      <T.MNav lang={lang} setLang={setLang} onBook={() => setBookingOpen(true)} />
      <T.MHero lang={lang} />
      <T.MMarquee lang={lang} />
      <T.MWelcome lang={lang} />
      <T.MRooms lang={lang} />
      <T.MBreakfast lang={lang} />
      <T.MStory lang={lang} />
      <T.MLocation lang={lang} />
      <T.MOutdoor lang={lang} />
      <T.MWeddings lang={lang} />
      <T.MReviews lang={lang} />
      <T.MContact lang={lang} />
      <T.MFooter lang={lang} />

      <T.MBookBar lang={lang} onBook={() => setBookingOpen(true)} />
      <T.MBookingModal lang={lang} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<VillaCorteseAppMobile />);
