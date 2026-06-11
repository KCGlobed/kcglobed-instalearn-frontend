import { useState } from "react"
import { Award, Download, Linkedin, CheckCircle2, Loader2, Share2 } from "lucide-react"
import { getCourseCertificate } from "../../utils/service"
import toast from "react-hot-toast"

interface CertificateProps {
    courseId: number
    progress: number
    courseName: string
}

const Certificate = ({ courseId, progress, courseName }: CertificateProps) => {
    const [downloading, setDownloading] = useState(false)
    const [sharingProfile, setSharingProfile] = useState(false)
    const [sharingPost, setSharingPost] = useState(false)

    const threshold = 50
    const isEligible = progress >= threshold

    const getUserName = () => {
        try {
            const profileStr = localStorage.getItem("userProfile")
            if (profileStr) {
                const profile = JSON.parse(profileStr)
                const user = profile.user || profile
                if (user.first_name || user.last_name) {
                    return `${user.first_name || ""} ${user.last_name || ""}`.trim()
                }
                if (user.name) return user.name
            }
        } catch (e) {
            console.error(e)
        }
        return "Student"
    }

    const getGcsDownloadUrl = (url: string) => {
        if (url.includes("storage.googleapis.com")) {
            try {
                // URL: https://storage.googleapis.com/bucket-name/path/to/file.svg
                const parts = url.split("storage.googleapis.com/")
                if (parts.length > 1) {
                    const subParts = parts[1].split("/")
                    const bucket = subParts[0]
                    const objectPath = subParts.slice(1).join("/")
                    return `https://storage.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(objectPath)}?alt=media`
                }
            } catch (e) {
                console.error("Error formatting GCS download URL", e)
            }
        }
        return url
    }

    const handleDownload = async () => {
        if (downloading) return
        setDownloading(true)
        const loadToast = toast.loading("Downloading certificate...")
        try {
            const response = await getCourseCertificate(courseId)
            const certificateUrl = response?.data

            if (!certificateUrl) {
                throw new Error("Certificate URL not found")
            }

            // Convert to GCS API download URL to bypass CORS limits
            const apiDownloadUrl = getGcsDownloadUrl(certificateUrl)

            // Fetch the certificate URL and convert to blob to force browser download
            const fileResponse = await fetch(apiDownloadUrl)
            const blob = await fileResponse.blob()
            const downloadUrl = window.URL.createObjectURL(blob)

            const extension = certificateUrl.split("?")[0].split(".").pop() || "svg"
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = `Certificate_${courseName.replace(/\s+/g, "_")}.${extension}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
            
            toast.success("Downloaded successfully!", { id: loadToast })
        } catch (error: any) {
            console.error("Failed to download directly:", error)
            toast.error("Direct download failed. Opening in a new tab.", { id: loadToast })
            
            // Fallback: open URL in a new tab
            try {
                const response = await getCourseCertificate(courseId)
                if (response?.data) {
                    window.open(response.data, "_blank")
                }
            } catch (e) {
                console.error("Fallback failed:", e)
            }
        } finally {
            setDownloading(false)
        }
    }

    const handleLinkedInShare = async (type: "post" | "profile") => {
        if (type === "profile") setSharingProfile(true)
        else setSharingPost(true)

        try {
            const response = await getCourseCertificate(courseId)
            const certUrl = response?.data || (window.location.origin + `/courses/${courseId}`)

            if (type === "profile") {
                const orgName = "InstaLearn"
                const issueYear = new Date().getFullYear()
                const issueMonth = new Date().getMonth() + 1
                const profileUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(courseName)}&organizationName=${encodeURIComponent(orgName)}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(certUrl)}&certId=${courseId}`
                window.open(profileUrl, "_blank")
                toast.success("Redirecting to LinkedIn profile setup...")
            } else {
                const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`
                window.open(shareUrl, "_blank")
                toast.success("Opening LinkedIn share...")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to share on LinkedIn")
        } finally {
            if (type === "profile") setSharingProfile(false)
            else setSharingPost(false)
        }
    }

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2d2f31]">Certificates</h2>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-[#d1d7dc] overflow-hidden">
                {!isEligible ? (
                    /* Empty State - Not Eligible */
                    <div className="py-24 text-center px-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[#2d2f31] mb-2">No certificates yet</h3>
                        <p className="text-[#6a6f73] mb-6 max-w-md mx-auto">
                            You are eligible to download the certificate after completing {threshold}% of the course. Currently, you have completed {progress}% of the course.
                        </p>
                        <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 mb-6">
                            <div
                                className="bg-[#a435f0] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    /* Eligible State - Show Premium Certificate Card & Download / Share buttons */
                    <div className="p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Certificate Graphic Placeholder */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div className="relative w-full max-w-[320px] aspect-[4/3] bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-8 border-double border-[#d4af37] rounded-lg p-6 shadow-md flex flex-col justify-between items-center text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/10 rounded-bl-full flex items-start justify-end p-2">
                                        <Award className="w-6 h-6 text-[#d4af37]" />
                                    </div>

                                    <div className="space-y-1 mt-2">
                                        <span className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">InstaLearn</span>
                                        <h4 className="text-[14px] font-serif font-bold text-[#2d2f31]">Certificate of Completion</h4>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 italic">This is proudly presented to</p>
                                        <p className="text-[14px] font-bold text-[#a435f0] border-b border-gray-300 pb-1 px-4 inline-block">{getUserName()}</p>
                                    </div>

                                    <div className="space-y-1 mb-2">
                                        <p className="text-[9px] text-gray-500 max-w-[200px] line-clamp-1">for successfully completing the course</p>
                                        <p className="text-[10px] font-bold text-[#2d2f31] line-clamp-2 max-w-[220px]">{courseName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions and details */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-bold">Congratulations! You've earned a certificate</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2d2f31]">
                                        {courseName}
                                    </h3>
                                    <p className="text-sm text-[#6a6f73]">
                                        Your dedication paid off. You have completed {progress}% of this course, making you eligible for the official completion certificate.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#a435f0] text-white font-bold rounded-md hover:bg-[#8710d8] disabled:bg-gray-400 transition-colors shadow-sm"
                                    >
                                        {downloading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Download className="w-5 h-5" />
                                        )}
                                        {downloading ? "Downloading..." : "Download Certificate"}
                                    </button>

                                    <button
                                        onClick={() => handleLinkedInShare("profile")}
                                        disabled={sharingProfile}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#0077b5] text-[#0077b5] font-bold rounded-md hover:bg-[#f0f7fa] disabled:opacity-50 transition-colors"
                                    >
                                        {sharingProfile ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Linkedin className="w-5 h-5 fill-[#0077b5]" />
                                        )}
                                        Add to LinkedIn
                                    </button>

                                    <button
                                        onClick={() => handleLinkedInShare("post")}
                                        disabled={sharingPost}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        {sharingPost ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Share2 className="w-5 h-5" />
                                        )}
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Certificate