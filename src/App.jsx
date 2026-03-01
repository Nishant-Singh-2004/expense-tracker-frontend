import { useState } from "react";
import { useEffect } from "react";
import ExpenseList from "./ExpenseList";

// test@gmail.com
// test123

function App() {
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [expenses, setExpenses] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    useEffect(() => {
        if (token) {
            fetchExpenses();
        }
    }, [token]);

    async function addExpense() {
        const res = await fetch("https://expense-tracker-backend-ypt6.onrender.com/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                amnt: Number(amount),
            }),
        });
        if (res.ok) {
            await fetchExpenses();
            setName("");
            setAmount("");
        } else {
            console.error("failed to add expense!");
        }
    }

    const total = expenses.reduce((sum, exp) => {
        return sum + exp.amnt;
    }, 0);

    let max = 0;

    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].amnt > max) {
            max = expenses[i].amnt;
        }
    }

    async function fetchMessage() {
        const res = await fetch("https://expense-tracker-backend-ypt6.onrender.com/");
        const data = await res.text();
        setMessage(data);
    }

    // async function fetchExpenses() {
    //     setLoading(true);
    //     const res = await fetch("https://expense-tracker-backend-ypt6.onrender.com/expenses", {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });
    //     const data = await res.json();
    //     setExpenses(data);

    //     setLoading(false);
    // }
    async function fetchExpenses() {
  setLoading(true);

  try {
    const res = await fetch(
      "https://expense-tracker-backend-ypt6.onrender.com/expenses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401) {
      console.log("Token invalid, logging out");
      logout();
      return;
    }

    const data = await res.json();
    setExpenses(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }

  setLoading(false);
}

    async function login() {
        const res = await fetch("https://expense-tracker-backend-ypt6.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setEmail("");
            setPassword("");
            // fetchExpenses(data.token);
        } else {
            alert("Login failed");
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setExpenses([]);
    }

    if (!token) {
        return (
            <div style={{ maxWidth: "400px", margin: "100px auto" }}>
                <h2>{isSignup ? "Signup" : "Login"}</h2>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        display: "block",
                        marginBottom: "10px",
                        width: "100%",
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        display: "block",
                        marginBottom: "10px",
                        width: "100%",
                    }}
                />

                {isSignup ? (
                    <button onClick={signup} style={{ width: "100%" }}>
                        Signup
                    </button>
                ) : (
                    <button onClick={login} style={{ width: "100%" }}>
                        Login
                    </button>
                )}

                <p style={{ marginTop: "10px", textAlign: "center" }}>
                    {isSignup
                        ? "Already have an account?"
                        : "Dont have an account?"}{" "}
                    <span
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? "Login" : "Signup"}
                    </span>
                </p>
            </div>
        );
    }

    if (loading) {
        return <h2>Loading expenses...</h2>;
    }

    async function signup() {
        const res = await fetch("https://expense-tracker-backend-ypt6.onrender.com/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful. Please Login.");
            setIsSignup(false);
            setEmail("");
            setPassword("");
        } else {
            alert(data.error || "Signup failed");
        }
    }

    async function deleteExpense(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this expense?");

        if (!confirmDelete) return;

        await fetch(`https://expense-tracker-backend-ypt6.onrender.com/expenses/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchExpenses();
    }

    // return (
    //     <div>
    //         <div style = {StyleSheet.header}>
    //         <h1>Expense Tracker</h1>
    //         <button onClick={logout}>Logout</button>
    //         </div>
    //         <input
    //         style={{ display: "block", marginBottom: "10px", width: "100%" }}
    //             type="text"
    //             placeholder="Expense Name"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //         />
    //         <input
    //         style={{ display: "block", marginBottom: "10px", width: "100%" }}
    //             type="number"
    //             placeholder="Expense amount"
    //             value={amount}
    //             onChange={(e) => setAmount(e.target.value)}
    //         />
    //         <button style ={{width: "100%"}} onClick={addExpense}>Add</button>

    //         <ExpenseList expenses={expenses} />

    //         <p>Total: {total}</p>
    //         <p>Max: {max}</p>

    //         <button onClick={fetchMessage}>Fetch from Backend</button>
    //         <p>{message}</p>

    //         {/* <p>{name}</p> */}
    //     </div>
    // );

    const styles = {
        page: {
            color: "black",
            minHeight: "100vh",
            width: "100%",
            background: "linear-gradient(135deg, #1f1f1f, #2c3e50)",
            display: "flex",
            padding: "40px 20px",
            justifyContent: "center",
            alignItems: "center",
        },
        card: {
            background: "white",
            padding: "40px",
            borderRadius: "14px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 10px 25px rgba(17, 9, 9, 0.25)",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
        },
        logoutBtn: {
            padding: "5px 10px",
            cursor: "pointer",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
        },
        input: {
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #b91616",
        },
        addBtn: {
            padding: "8px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
            opacity: name && amount ? 1 : 0.6,
        },
        list: {
            borderTop: "1px solid #e01b1b",
            paddingTop: "10px",
        },
        expenseItem: {
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            borderBottom: "1px solid #5417ce",
        },
    };

    const totalAmount = expenses.reduce((sum, exp) => {
        return sum + exp.amnt;
    }, 0);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2>Expense Tracker</h2>
                    <button onClick={logout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>

                <div style={styles.form}>
                    <input
                        placeholder="Expense name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={styles.input}
                    />

                    <button onClick={addExpense} style={styles.addBtn} disabled={!name || !amount}>
                        Add Expense
                    </button>
                </div>

                <div style = {{
                    marginBottom: "15px",
                    padding: "8px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "6px",
                    textAlign: "right",
                    fontWeight: "600"
                }}>Total: ₹ {totalAmount}</div>

                <div style={styles.list}>
                    {expenses.length === 0 ? (
                        <p style={{ textAlign: "center" }}>No expenses yet.</p>
                    ) : (
                        expenses.map((exp) => (
                            <div key={exp._id} style={styles.expenseItem}>
                                <span>
                                    {exp.name} - ₹ {exp.amnt}
                                </span>
                                <button
                                    onClick={() => deleteExpense(exp._id)}
                                    style={{
                                        backgroundColor: "#ff4d4d",
                                        color: "white",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
