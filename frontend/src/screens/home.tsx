import FooterContent from "../components/footer"
import TopNavigation from "../navigations/topNavigation"

export default function HomeScreen() {
    return (
        <>
            <nav><TopNavigation/></nav>

            <main className="p-4 min-h-[calc(100vh-3rem)] flex flex-row gap-4">
                <div className="bg-red-500 rounded-2xl w-80">Home Page</div>
                <div className="bg-blue-500 rounded-2xl h-12 w-12"></div>
            </main>

            <footer><FooterContent/></footer>
        </>
    )
}