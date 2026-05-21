import { SignupForm } from "@/components/signup-form"


export default function Page() {
  return (
  <div className="w-screen grid md:grid-cols-2">
    <div className="hidden relative md:block bg-[url('/landscapeView.jpeg')] bg-cover bg-center h-full items-center justify-center  text-center rounded-r-xl blur-bg ">
      <p className="text-6xl text-green-50 font-alan font-semibold mt-10 ">Green Market</p>
      <div className="flex flex-col mt-60 px-8 w-[90%] items-center justify-center text-center">
        <p className= "text-6xl w-[80%] text-justify-center items-center text-green-50 font-alan font-semibold space-y-4 )">"Creativity  is  Intelligence  having  fun"</p>
        <p className="mt-6 text-lg font-medium text-green-50">- Albert Einstein</p>
      </div>
    </div>
    <div className="flex min-h-svh  items-center justify-center p-6 md:p-10">
      
      <div className="w-full max-w-sm">
        <SignupForm/>
        
      </div>
    </div>
    
     
    
  </div>  
  )
}
