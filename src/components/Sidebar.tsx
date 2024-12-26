import { Link } from 'react-router-dom';
import { LogOut, Newspaper } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useReduxHook';
import { logout } from '@/redux/authSlice';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex">
      <div className="w-14 sm:w-20 h-screen p-4  border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link to="/posts">
            <div className="bg-indigo-800 text-white p-1.5 sm:p-3 rounded-lg inline-block">
              <Newspaper />
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <button
            className="bg-red-100 hover:bg-red-200 cursor-pointer my-4 p-1.5 sm:p-3 rounded-lg inline-block"
            onClick={() => dispatch(logout())}
          >
            <LogOut className="text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
