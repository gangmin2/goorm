import React, { useState } from "react";
import styled from 'styled-components';

// Styled components 정의
const StyledInput = styled.input`
  padding: 8px 0;
  border: none;
  border-bottom: 1.5px solid #ddd;
  outline: none;

  &:focus {
    border-bottom: 1.5px solid cornflowerblue;
  }
`;

const StyledButton = styled.button`
  background-color: cornflowerblue;
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 4px;
  box-shadow: 3px 3px 6px #3333;
  cursor: pointer;
  transition: all 0.4s;

  &:hover {
    background-color: #4472c7;
  }
`;

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const AppTitle = styled.h1`
  color: cornflowerblue;
  margin-top: 32px;
`;

const AppContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 5px 5px 10px #3333;
`;

const AppForm = styled.form`
  margin-bottom: 32px;
`;

const FormInputs = styled.div`
  display: flex;
  margin-bottom: 16px;

  & > div {
    display: flex;
    flex-direction: column;
    flex: 1;

    & + div {
      margin-left: 24px;
    }
  }

  & label {
    color: cornflowerblue;
    margin-bottom: 8px;
  }
`;

const ItemBox = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  align-items: center;
  margin-bottom: 16px;
  transition: all 0.6s;
  background-color: white;

  &:hover {
    transform: scale(1.02);
  }

  & button {
    margin-left: 8px;
  }
`;

const Amount = styled.p`
  text-align: end;
  font-size: 18px;
  font-weight: 700;
  color: cornflowerblue;
`;

function App() {
	const [budgetData, setBudgetData] = useState([]);
	const [newTitle, setNewTitle] = useState('');
	const [newCost, setNewCost] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState(null);

	const handleTitleChange = (event) => {
		setNewTitle(event.target.value);
	};

	const handleCostChange = (event) => {
		setNewCost(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const newEntry = {
			id: editingId ? editingId : String(budgetData.length + 1),
			title: newTitle,
			cost: Number(newCost),
		};

		if (isEditing) {
			setBudgetData(budgetData.map(item => item.id === editingId ? newEntry : item));
		} else {
			setBudgetData([...budgetData, newEntry]);
		}

		// Reset the form
		setNewTitle('');
		setNewCost('');
		setIsEditing(false);
		setEditingId(null);
	};

	const handleEditItem = (item) => {
		setNewTitle(item.title);
		setNewCost(item.cost.toString());
		setIsEditing(true);
		setEditingId(item.id);
	};

	const handleDeleteItem = (id) => {
		setBudgetData(budgetData.filter(item => item.id !== id));
	};

	const handleReset = () => {
		setBudgetData([]);
	};

	const getTotalCost = () => {
		return budgetData.reduce((acc, item) => acc + item.cost, 0).toLocaleString();
	};

	return (
		<Container>
			<AppTitle>Budget Calculator</AppTitle>

			<AppContainer>
				<AppForm onSubmit={handleSubmit}>
					<FormInputs>
						<div>
							<label htmlFor="title">지출 항목</label>
							<StyledInput id="title" type="text" value={newTitle} onChange={handleTitleChange} placeholder="예) 렌트비" />
						</div>
						<div>
							<label htmlFor="cost">비용</label>
							<StyledInput id="cost" type="number" value={newCost} onChange={handleCostChange} />
						</div>
					</FormInputs>
					<StyledButton type="submit">{isEditing ? '수정' : '제출'}</StyledButton>
				</AppForm>

				{budgetData.length > 0 ? (
					budgetData.map((item) => (
						<ItemBox key={item.id}>
							<span>{item.title}</span>
							<span>{item.cost.toLocaleString()}</span>
							<div>
								<StyledButton onClick={() => handleEditItem(item)}>수정</StyledButton>
								<StyledButton onClick={() => handleDeleteItem(item.id)}>삭제</StyledButton>
							</div>
						</ItemBox>
					))
				) : (
					<p>목록을 추가해주세요 :)</p>
				)}
				<StyledButton onClick={handleReset}>목록 비우기</StyledButton>
			</AppContainer>

			<Amount>총지출: <span>{getTotalCost()}</span>원</Amount>
		</Container>
	);
}

export default App;
