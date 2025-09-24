"use client"

import { saveResume, recommendSkills } from "@/actions/resume"
import { resumeSchema } from "@/app/lib/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/use-fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, DownloadIcon, FileEdit, Loader2Icon, LoaderCircle, MonitorCheck, Save, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { EntryForm } from "./entry-form"
import { entriesToMarkdown } from "@/app/lib/helper"
import MDEditor, { image } from "@uiw/react-md-editor"
import { useUser } from "@clerk/nextjs"
import html2pdf from "html2pdf.js"

const ResumeBuilder = ({initialContent}) => {
    const [activeTab, setActiveTab] = useState("edit");
    const [resumeMode, setResumeMode] = useState("preview");
    const [previewContent, setPreviewContent] = useState(initialContent);
    const{user} = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const{
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        formState:{errors},
    }=useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues:{
            contactInfo: {},
            summary:"",
            skills:"",
            experience: [],
            education:[],
            projects:[],
        }
    })

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    }= useFetch(saveResume);

    const formValues = watch();

    useEffect(()=> {
        if(initialContent) setActiveTab("preview");
    }, [initialContent]);

    useEffect(()=>{
        if(activeTab ==="edit"){
            const newContent = getCombinedContent();
            setPreviewContent(newContent? newContent:initialContent);
        }
    },[formValues, activeTab])

    const getContactMarkdown =() =>{
        const {contactInfo} = formValues;
        const parts=[];
        if(contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if(contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if(contactInfo.linkedin) parts.push(`🔗 [LinkedIn](${contactInfo.linkedin})`);
        if(contactInfo.twitter) parts.push(`🐦[Twitter](${contactInfo.twitter})`); 
         return parts.length > 0
        ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
        : "";
        }

    const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };


  useEffect(()=>{
    if (saveResult && !isSaving) {
        toast.success("Resume Saved Successfully!")
    }
    if (saveError) {
        toast.error(saveError.message || "Failed to Save Resume")
    }
   }, [saveResult, saveError, isSaving])

    const onSubmit= async () => {
        try {
            await saveResumeFn(previewContent)
        } catch (error) {
            console.error("Save Error:", error)
        }
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
           const element = document.getElementById("resume-pdf") 
           const opt ={
            margin:[15,15],
            filename: "resume.pdf",
            image: {type:"jpeg", quality: 0.98},
            html2canvas: {scale:2},
            jsPDF: {unit: "mm", format:"a4", orientaion: "portrait"}
           }
          await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Generation Error:", error)
        } finally{
            setIsGenerating(false);
        }
    }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Bulider</h1>
        <div className="space-x-2">
            <Button variant="outline" className="bg-green-700 text-white hover:bg-green-900"
              onClick={onSubmit}
              disabled={isSaving}>
                {isSaving ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                      Saving...
                    </>
                ):(
                    <>
                    <Save className="h-4 w-4"/>
                    Save Resume
                </>) }
                
            </Button>
            <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-800" 
              onClick={generatePDF} disabled={isGenerating}>
                {isGenerating ?(
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin"/>
                      Generating PDF....
                    </>
                ) : (
                    <>
                      <DownloadIcon className="h-4 w-4"/>
                       Download PDF
                    </>)}
            </Button>
        </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="edit">Form</TabsTrigger>
              <TabsTrigger value="preview">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <form className="space-y-8">
                    {/* --- Contact Info --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Email</Label>
                            <Input {...register("contactInfo.email")}
                            type="email"
                            placeholder="your@email.com"
                            />
                            {errors.contactInfo?.email && (
                                <p className="text-sm text-red-500">
                                    {errors.contactInfo.email.message}
                                </p>
                            )}
                        </div>
                        {/* Mobile */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Mobile</Label>
                            <Input {...register("contactInfo.mobile")}
                            type="tel"
                            placeholder="+91 920 985 2020"
                            />
                            {errors.contactInfo?.mobile && (
                                <p className="text-sm text-red-500">
                                    {errors.contactInfo.mobile.message}
                                </p>
                            )}
                        </div>
                        {/* LinkedIn */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">LinkedIn URL</Label>
                            <Input {...register("contactInfo.linkedin")}
                            type="url"
                            placeholder="https://linkedin.com/in/your-profile"
                            />
                            {errors.contactInfo?.linkedin && (
                                <p className="text-sm text-red-500">
                                    {errors.contactInfo.linkedin.message}
                                </p>
                            )}
                        </div>
                        {/* Twitter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Twitter/X Profile</Label>
                            <Input {...register("contactInfo.twitter")}
                            type="url"
                            placeholder="https://twitter.com/in/your-profile"
                            />
                            {errors.contactInfo?.twitter && (
                                <p className="text-sm text-red-500">
                                    {errors.contactInfo.twitter.message}
                                </p>
                            )}
                        </div>
                        </div>
                    </div>

                    {/* --- Summary --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Professional Summary</h3>
                        <Controller 
                            name="summary"
                            control={control}
                            render={({field})=>(
                                <Textarea
                                    {...field}
                                    className="h-32"
                                    placeholder="Write a Compelling Professional Summary..."
                                />
                            )}
                        />
                        {errors.summary && (
                            <p className="text-sm text-red-500">{errors.summary.message} </p>
                        )}
                    </div>

                    {/* --- Skills --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Skills</h3>
                        <Controller 
                            name="skills"
                            control={control}
                            render={({field})=>(
                                <>
                                  <Textarea
                                      {...field}
                                      className="h-32"
                                      placeholder="Highlight Your Key Skills..."
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2"
                                    onClick={async () => {
                                      try {
                                        const res = await recommendSkills({ currentSkills: watch("skills") });
                                        field.onChange(
                                          watch("skills") + (watch("skills") ? ", " : "") + res.join(", ")
                                        );
                                        toast.success("AI recommended new skills added!");
                                      } catch (err) {
                                        toast.error("Failed to fetch AI skill suggestions");
                                      }
                                    }}
                                  >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Recommend Skills with AI
                                  </Button>
                                </>
                            )}
                        />
                        {errors.skills && (
                            <p className="text-sm text-red-500">{errors.skills.message} </p>
                        )}
                    </div>

                    {/* --- Experience --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Work Experience</h3>
                        <Controller 
                            name="experience"
                            control={control}
                            render={({field})=>(
                                <EntryForm
                                type="Experience"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.experience && (
                            <p className="text-sm text-red-500">{errors.experience.message} </p>
                        )}
                    </div>

                    {/* --- Education --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Education</h3>
                        <Controller 
                            name="education"
                            control={control}
                            render={({field})=>(
                                <EntryForm
                                type="Education"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                               )}
                        />
                        {errors.education && (
                            <p className="text-sm text-red-500">{errors.education.message} </p>
                        )}
                    </div>

                    {/* --- Projects --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Projects</h3>
                        <Controller 
                            name="projects"
                            control={control}
                            render={({field})=>(
                                <EntryForm
                                type="Project"
                                entries={field.value}
                                onChange={field.onChange}
                                />
                                )}
                        />
                        {errors.projects && (
                            <p className="text-sm text-red-500">{errors.projects.message} </p>
                        )}
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="preview">
                <Button variant="link" type="button" className="mb-2"
                    onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
                >
                    {resumeMode === "preview" ? (
                        <>
                            <FileEdit className="h-4 w-4"/>
                            Edit Resume
                        </>
                    ) : (
                        <>
                            <MonitorCheck className="h-4 w-4"/>
                            Show Preview

                        </>
                    )}
                    
                </Button>

                {resumeMode !== "preview" && (
                    <div className="flex p-3 gap-2 items-center border-2 border-yellow-700
                    text-yellow-600 rounded mb-2">
                        <AlertTriangle className="h-5 w-5"/>
                        <span className="text-sm">You will lose editied markdown if you update the form data.</span>
                    </div>
                )}

                <div className="border rounded-lg">
                    <MDEditor value={previewContent} onChange={setPreviewContent}
                      height={800}
                      preview={resumeMode}/>
                </div>

                <div className="hidden">
                    <div id="resume-pdf">
                    <MDEditor.Markdown source={previewContent} 
                     style={{
                        background:"white",
                        color:"black"
                     }}/>
                    </div>
                </div>

            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ResumeBuilder
