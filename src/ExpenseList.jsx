function ExpenseList({expenses}){
	return(
		<ul>
        {expenses.map((exp, index) => (
          <li key={index}>
            {exp.name} - {exp.amnt}
          </li>
        ))}
      </ul>
	);
}

export default ExpenseList;