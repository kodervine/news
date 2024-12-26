import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

const AppLayout = () => {
  return (
    <main className="flex flex-row w-full">
      <div className="fixed top-0 left-0 flex flex-col h-screen overflow-y-auto">
        <Sidebar />
      </div>

      <section className="flex flex-col w-full lg:px-4 ml-10 lg:ml-20 overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
};
export default AppLayout;
