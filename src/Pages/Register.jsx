import { Alert,Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Register = () => {
    const {registerInfo , updateRegisterInfo, registerError,registerUser, isRegisterLoading} = useContext(AuthContext)

    return (  
      <>
      <Form onSubmit={registerUser}>
        <Row style={{
            height:"100vh",
            justifyContent: "center",
            paddingTop:"10%"
        }}>
            <Col xs={6}>
            <Stack gap={3}>
                <h2>Register</h2>
                <Form.Control type="text" placeholder="Enter Your Name" onChange={(e)=> updateRegisterInfo({...registerInfo,name:e.target.value})}/>
                <Form.Control type="email" placeholder="Enter Your Email" onChange={(e)=> updateRegisterInfo({...registerInfo,email:e.target.value})} />
                <Form.Control type="password" placeholder="Enter Your Password" onChange={(e)=> updateRegisterInfo({...registerInfo,password:e.target.value})}/>
                <Button variant="primary" type="submit">
                    {isRegisterLoading? "Creating your account": "Register"}
                </Button>
                {
                    registerError?.error &&(<Alert variant="danger">
                    <p>{registerError.message.error}</p>
                </Alert>

                )}
                
            </Stack>
            </Col>
        </Row>
      </Form>
      </>
    );
  }
   
  export default Register;