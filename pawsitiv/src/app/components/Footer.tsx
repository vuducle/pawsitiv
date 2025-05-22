export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 p-6 mt-12 text-center rounded-t-xl shadow-inner">
            <div className="container mx-auto">
            <p className="text-sm">&copy; {new Date().getFullYear()} Pawsitiv Next. All rights reserved.</p>
            <p className="text-xs mt-2">Powered by Next.js and Tailwind CSS</p>
            </div>
        </footer>
    );
    }