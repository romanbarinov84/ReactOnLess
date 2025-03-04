import { Layout,Select,Space,Button,Modal } from 'antd';
import{useCrypto} from ".././context/crypto-context.jsx"
import {useEffect,useState} from "react"

const headerStyle = {
    textAlign: 'center',
    width:"100%",
    height: "60px",
    padding:"1rem",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    background:"cornFlowerBlue"
  };
 
export default function AppHeader(){
    const [select,setSelect] = useState(false)
    const[modal,setModal] = useState(false)
   const {crypto} = useCrypto()

   useEffect(() => {
    const keypress = (event) => {
        if(event.key === "/"){
            setSelect((prev) => !prev)
        }
    }
    document.addEventListener("keypress",keypress)
    return () => document.removeEventListener("keypress",keypress)
}, [])

function handleSelect(value) {
    setModal(true)
}



    return (
        <Layout.Header style={headerStyle}>
             <Select
   
    style={{
      width: 250,
    }}
    open={select}
     onSelect={handleSelect}
     onClick={() => setSelect((prev) => !prev)}
    value="press / to open"
    options={crypto.map((coin) => ({
        label:coin.name,
        value:coin.id,
        icon:coin.icon,
    }))}
    optionRender={(option) => (
      <Space>
       <img style={{width:20}} src={option.data.icon} alt={option.data.label}/>{option.data.label}
        
        
        
      </Space>
    )}
  />
   <Button type="primary">Add Asset</Button>

   <Modal open={modal} onOk={() => setModal((false))} onCancel={() => setModal((false))} footer={null}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
        </Layout.Header>
    )
}