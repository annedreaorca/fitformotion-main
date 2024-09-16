
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mb-[-100px] py-[12px] z-40 page-width">
      <div className="copyright">
        <p className="text-center text-stone-300">
          @ {currentYear} Trifecta Proximity. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}