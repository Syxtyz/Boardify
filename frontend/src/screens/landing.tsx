import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import FooterContent from "../components/footerContent"
import TopNavigation from "../components/topNavigation/navigation"
import { motion, type Variants } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LoginButton from "@/components/topNavigation/loginButton"
import { useRef } from "react"

export default function LandingScreen() {
    const topSection = useRef<HTMLElement | null>(null)

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
        },
    }

    const featureFade: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        }),
    }

    const scrollToTop = () => {
        topSection.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <>
            <nav className="fixed top-0 left-0 w-full"><TopNavigation /></nav>

            <ScrollArea className="h-[calc(100vh-3rem)] mt-12">
                <main className="flex flex-col my-24 gap-24">
                    <section ref={topSection} className="flex flex-col gap-6 items-center justify-center text-center px-4 from-background via-muted/50 to-background">
                        <motion.h2
                            className="text-5xl font-bold tracking-tight"
                            variants={fadeInUp}
                            initial="hidden"
                            animate="show"
                        >
                            Organize your work, <br /> the <span className="text-blue-500">Boardify</span> way.
                        </motion.h2>

                        <motion.p
                            className="text-muted-foreground max-w-md"
                            variants={fadeInUp}
                            initial="hidden"
                            animate="show"
                            transition={{ delay: 0.3 }}
                        >
                            Plan smarter, collaborate faster, and keep every task right where you need it.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="show"
                            transition={{ delay: 0.6 }}
                        >
                            <LoginButton variant="default" size="lg">
                                Get Started <ArrowRightIcon className="w-4 h-4" />
                            </LoginButton>
                        </motion.div>
                    </section>

                    <section className="px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { title: "Boards & Lists", desc: "Stay organized with flexible boards and draggable lists." },
                            { title: "Collaboration", desc: "Invite teammates and track progress in real-time." },
                            { title: "Customization", desc: "Adapt your workflow with themes, filters, and more." },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={featureFade}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                            >
                                <Card className="shadow-md hover:shadow-lg border border-border/40">
                                    <CardContent className="text-center flex flex-col pt-6 gap-3">
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </section>

                    <section className="text-center px-8 flex flex-col gap-6">
                        <h2 className="text-3xl font-bold">How It Works</h2>
                        <div className="px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                { step: "1", title: "Create a Board", desc: "Start fresh with your own workspace." },
                                { step: "2", title: "Add Lists & Cards", desc: "Organize your workflow into tasks and subtasks." },
                                { step: "3", title: "Track Progress", desc: "Collaborate, move cards, and stay updated in real time." },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    variants={featureFade}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                >
                                    <div className="order rounded-lg bg-background shadow-md hover:shadow-lg flex flex-col gap-3 h-full p-6">
                                        <div className="w-10 h-10 mx-auto flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                                            {step.step}
                                        </div>
                                        <h3 className="font-semibold">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="text-center px-8">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Organized?</h2>
                        <p className="mb-6 max-w-md mx-auto">
                            Start using Boardify today — it's free to begin, simple to master.
                        </p>
                        <Button
                            onClick={scrollToTop}
                            size="lg"
                            className="font-semibold cursor-pointer"
                        >
                            Start for Free <ArrowRightIcon className=" w-4 h-4" />
                        </Button>
                    </section>
                </main>

                <footer className="flex flex-col items-center justify-center mx-8">
                    <FooterContent />
                </footer>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </>
    )
}