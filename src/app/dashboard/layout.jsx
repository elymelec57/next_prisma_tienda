import NavBar from "@/components/NavBar";
export default function LayoutDashboard({ children }) {
  return (
    <>
      <div>
        <NavBar />
      </div>
      {children}
    </>
  );
}