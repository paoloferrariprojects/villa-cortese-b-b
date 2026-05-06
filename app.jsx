/* eslint-disable */
// Villa Cortese — main app entry

const { useState, useEffect } = React;

function VillaCorteseApp() {
  const [lang, setLang] = useState("it");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formState, setFormState] = useState({
    checkin: "",
    checkout: "",
    guests: "2",
    room: "any",
  });

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  window.useReveal();

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  const T = window;

  return (
    <>
      <T.Nav lang={lang} setLang={setLang} onBook={openBooking} />
      <T.Hero lang={lang} variant="fullbleed" />
      <T.Marquee lang={lang} />
      <T.Welcome lang={lang} />
      <T.Rooms lang={lang} />
      <T.Breakfast lang={lang} />
      <T.Story lang={lang} />
      <T.Location lang={lang} />
      <T.Outdoor lang={lang} />
      <T.Weddings lang={lang} />
      <T.Reviews lang={lang} />
      <T.BookingBand lang={lang} onBook={openBooking} formState={formState} setFormState={setFormState} />
      <T.Contact lang={lang} />
      <T.Footer lang={lang} />

      <T.BookingModal lang={lang} open={bookingOpen} onClose={closeBooking} formState={formState} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<VillaCorteseApp />);
