interface SideNavigationProps {
    workplaceOpen: boolean;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ workplaceOpen }) => {
    return (
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                workplaceOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
            <div className="bg-gray-100 shadow-sm w-98 h-screen p-2.5 text-white">
                <div className="mt-10 flex justify-between items-center">
                    <h1 className="text-gray-900">Your boards</h1>
                    <button className="cursor-pointer text-2xl text-gray-900">+</button>
                </div>
            </div>
        </div>
    );
};

export default SideNavigation;