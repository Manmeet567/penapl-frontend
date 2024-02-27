import {Zoom} from '@mui/material';
import {useState} from 'react'

function OptionsIcon({iconClicked, setIconClicked}) {

  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="options-icon" style={{display:"flex", marginTop:"25px"}}>
      <span onClick={() => {setIconClicked(prev => !prev); handleChange()}} style={{ width:"32px", height:"32px",borderRadius:"50%", border:"1px solid #000", display:"flex", alignItems:"center", transition:".1s linear",justifyContent:"center", transform: iconClicked ? "rotate(45deg)" : "rotate(0deg)", marginRight:"20px", cursor:"pointer"}}><svg class="svgIcon-use" width="25" height="25"><path d="M20 12h-7V5h-1v7H5v1h7v7h1v-7h7" fill-rule="evenodd"></path></svg></span>

      <Zoom in={checked} style={{display:iconClicked ? "inline" : "none"}}>
        <span style={{marginRight:"10px", cursor:"pointer"}} title='Add Image'>
          <svg class="svgIcon-use" width="32" height="32" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 17a2 2 0 100-4 2 2 0 000 4zm0-1a1 1 0 100-2 1 1 0 000 2z" fill="#1A8917"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 10h12a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8a2 2 0 012-2zm0 1a1 1 0 00-1 1v4.293l2.646-2.647a.5.5 0 01.708 0L19.707 21H22a1 1 0 001-1v-8a1 1 0 00-1-1H10zm8.293 10L12 14.707l-3 3V20a1 1 0 001 1h8.293z" fill="#1A8917"></path><rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect></svg>
        </span>
      </Zoom>
        
        <Zoom in={checked} style={{ transitionDelay: checked ? '50ms' : '0ms', display:iconClicked ? "inline" : "none" }}>
          <span style={{marginRight:"10px", cursor:"pointer"}} title='Add a video'>
            <svg class="svgIcon-use" width="32" height="32" fill="none"><rect x="8.5" y="10.761" width="15" height="11.522" rx="1.5" stroke="#1A8917"></rect><path d="M19.5 16.522l-5.25 3.614v-7.229l5.25 3.615z" stroke="#1A8917" stroke-linejoin="round"></path><rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect></svg>
          </span>
        </Zoom>

        <Zoom in={checked} style={{ transitionDelay: checked ? '100ms' : '0ms', display:iconClicked ? "inline" : "none" }}>
        <span style={{marginRight:"10px", cursor:"pointer"}} title='Add a new code block'>
          <svg class="svgIcon-use" width="33" height="33" viewBox="0 0 32 32" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.05 9.441c.771-.724 1.773-.941 2.7-.941 0 0 .5 0 .5.5s-.5.5-.5.5c-.787 0-1.5.186-2.014.67-.51.479-.914 1.332-.914 2.858 0 1.285-.32 2.232-.907 2.859-.131.14-.272.26-.42.363.148.103.289.223.42.363.587.627.907 1.574.907 2.86 0 1.525.404 2.378.914 2.857.515.484 1.227.67 2.014.67 0 0 .5 0 .5.5s-.5.5-.5.5c-.927 0-1.929-.217-2.7-.941-.776-.73-1.228-1.89-1.228-3.587 0-1.131-.281-1.796-.637-2.175-.352-.376-1.435-.547-1.435-.547s-.5 0-.5-.5.5-.5.5-.5 1.083-.17 1.435-.547c.356-.38.637-1.044.637-2.175 0-1.697.452-2.857 1.229-3.587zm9.9 0c-.771-.724-1.773-.941-2.7-.941 0 0-.5 0-.5.5s.5.5.5.5c.787 0 1.5.186 2.015.67.51.479.913 1.332.913 2.858 0 1.285.32 2.232.907 2.859.131.14.272.26.42.363a2.633 2.633 0 00-.42.363c-.587.627-.907 1.574-.907 2.86 0 1.525-.404 2.378-.913 2.857-.516.484-1.228.67-2.015.67 0 0-.5 0-.5.5s.5.5.5.5c.927 0 1.929-.217 2.7-.941.776-.73 1.229-1.89 1.229-3.587 0-1.131.28-1.796.636-2.175.352-.376 1.435-.547 1.435-.547s.5 0 .5-.5-.5-.5-.5-.5-1.083-.17-1.435-.547c-.356-.38-.637-1.044-.637-2.175 0-1.697-.452-2.857-1.229-3.587z" fill="#1A8917"></path><rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect></svg>
        </span>
        </Zoom>


        <Zoom in={checked} style={{ transitionDelay: checked ? '150ms' : '0ms', display:iconClicked ? "inline" : "none" }}>
        <span style={{cursor:"pointer", height:"32px", width:"32px"}} title='Add a Divider'>
          <svg class="svgIcon-use" width="32" height="32" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5a.5.5 0 01.5-.5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5z" fill="#1A8917"></path><path d="M17 16.5a1 1 0 11-2 0 1 1 0 012 0z" fill="#1A8917"></path><path d="M12 16.5a1 1 0 11-2 0 1 1 0 012 0z" fill="#1A8917"></path><path d="M22 16.5a1 1 0 11-2 0 1 1 0 012 0z" fill="#1A8917"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 22.5a.5.5 0 01.5-.5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5z" fill="#1A8917"></path><rect x=".5" y=".5" width="31" height="31" rx="15.5" stroke="#1A8917"></rect></svg>
        </span>
        </Zoom>

    </div>
  )
}

export default OptionsIcon
