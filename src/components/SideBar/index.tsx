// components/Sidebar.tsx
const Sidebar = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='fixed  top-0 h-full w-52 max-w-60 bg-gradient-to-b from-black to-gray-900 flex flex-col items-center py-8'>
			{children}
		</div>
	);
};

export default Sidebar;
