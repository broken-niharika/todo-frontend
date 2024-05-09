import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

function App() {
	const [userInput, setUserInput] = useState("");
	const [list, setList] = useState();


	useEffect(() => {
		fetch("/api")
			.then(response => response.json())
			.then(data => {
				console.log("fetched data " + data);
				
				setList(data.tasks)
			}).catch(error => console.error("Error fetching data..", error)
			)
	}, [])
	const updateInput = (value) => {
		setUserInput(value);
	};
 
	// adding tasks to list
	const addItem = async (url) => {
		if(userInput.trim() === "") return;
		const res = await fetch(url, {
			method	: "POST",
			headers :  {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ newItem: userInput })
		}).catch((e) => {
			console.warn('error while fetching : ', e);
			return null;
		});

		if(!res) return;

		const response_body = await res.json().catch((e) => {
			console.warn('error while json parsing data : ', e);
			return null;
		});
		if(!response_body) return null;

		const tasks  = response_body.tasks;
		if(!tasks) return console.warn('no tasks found');
		setList([...list,tasks])
		setUserInput("");

	}
	const delete_item = async (url) => {
		const res = await fetch(url, {
			method: "POST"
		}).catch((e) => {
			console.warn('Error while fetching:', e);
			return null;
		});
	
		if (!res) return;
	
		const response_body = await res.json().catch((e) => {
			console.warn('Error while parsing JSON data:', e);
			return null;
		});
	
		if (!response_body) return null;
		// handling the response : updating ui by updating list
		console.log(response_body);
	    const tasks  = response_body.tasks;
		if(!tasks) return console.warn('no tasks found');
		setList([...list,tasks])
	};

	const editItem = (index) => {
		const editedTodo = prompt("Edit the todo:");
		if (editedTodo != null && editedTodo.trim() !== "") {
			const updatedList = [...list];
			updatedList[index].value = editedTodo;
			setList(updatedList);
		}
	};


	const url = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

	return (


		<Container>
		
			<Row
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					fontSize: "3rem",
					fontWeight: "bolder"
				}}
			>
				TODO LIST
			</Row>

			<hr />
			<Row>
				<Col md={{ span: 5, offset: 4 }}>
					<InputGroup className="mb-3">
						<FormControl
							placeholder="add item . . . "
							size="lg"
							value={userInput}
							onChange={(e) => updateInput(e.target.value)}
							aria-label="add something"
							aria-describedby="basic-addon2"
						/>
						<InputGroup>
							<Button
								variant="dark"
								className="mt-2"
								onClick={async() => {await addItem(`${url}/api/add`)}}
							>
								ADD
							</Button>
						</InputGroup>

					</InputGroup>
				</Col>
			</Row>

			<Row>
				<Col md={{ span: 5, offset: 4 }}>
					<ListGroup>
						
						{list && list.map((item, index) => (
							
							<div key={index}>
								<ListGroup.Item
									variant="dark"
									action
									style={{
										display: "flex",
										justifyContent: "space-between"
									}}
								>
									{JSON.stringify(item)}
									 {/* {item} */}
									<span>
										<Button
											style={{ marginRight: "10px" }}
											variant="light"
											// onClick={() => deleteItem(item.id)}
											onClick = { async() => {await delete_item(`${url}/api/${item}`)}}
										>
											Delete
										</Button>
										<Button variant="light" onClick={() => editItem(index)}>
											Edit
										</Button>
									</span>
								</ListGroup.Item>
							</div>
						))}
					</ListGroup>
				</Col>
			</Row>
		</Container>
	)
}




export default App;
