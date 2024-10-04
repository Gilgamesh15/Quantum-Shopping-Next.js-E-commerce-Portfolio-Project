import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      <div className="pt-10">{children}</div>
      <Footer />
    </div>
  );
}
