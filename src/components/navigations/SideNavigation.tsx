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
            <div className="bg-black w-98 h-screen p-2.5 text-white">
                <div className="mt-10 flex justify-between items-center">
                    <h1>Your boards</h1>
                    <button className="cursor-pointer text-2xl">+</button>
                </div>
            </div>
        </div>
    );
};

export default SideNavigation;