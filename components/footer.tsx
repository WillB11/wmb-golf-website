import { Instagram, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-primary text-white py-2 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center gap-1">
          <Image
            src="/images/wmb-logo-footer.png"
            alt="WMB Golf Co. - Custom Laser Engraved Golf Clubs"
            width={350}
            height={350}
            className="w-[350px] h-auto"
          />

          <div className="flex items-center gap-4">
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="mailto:info@wmbgolfco.com" className="text-white/80 hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
            <span className="text-sm text-white/80">info@wmbgolfco.com</span>
          </div>

          <div className="border-t border-white/20 pt-1 w-full text-center text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} WMB Golf Co. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
