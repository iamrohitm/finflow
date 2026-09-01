import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/AddExpense';
import AddIncomeModal from '../components/Modals/AddIncome';
import { addDoc, collection, getDocs, query, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';
import Loader from '../components/Loader';





const Dashboard = () => {
  // const transactions = [
  //   {
  //     type: 'income',
  //     amount: 1200,
  //     tag: 'salary',
  //     name: 'income 1',
  //     date: '2026-06-11'
  //   },
  //   {
  //     type: 'expense',
  //     amount: 800,
  //     tag: 'food',
  //     name: 'expense 1',
  //     date: '2026-06-19'
  //   }
  // ]
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const resetBalance = async () => {
    if (!user) return;

    Modal.confirm({
      title: 'Reset all transactions?',
      content: 'This will permanently delete every transaction for your account. This action cannot be undone.',
      okText: 'Reset Balance',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setLoading(true);

        try {
          const q = query(collection(db, `users/${user.uid}/transactions`));
          const snapshot = await getDocs(q);
          const batch = writeBatch(db);

          snapshot.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });

          if (!snapshot.empty) {
            await batch.commit();
          }

          setTransactions([]);
          setIncome(0);
          setExpense(0);
          setTotalBalance(0);
          toast.success("Balance Reset Successfully!");
        } catch (error) {
          console.error('Error resetting balance: ', error);
          toast.error('Could not reset balance. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      const transactionWithId = {
        ...transaction,
        id: docRef.id,
      };

      setTransactions((prevTransactions) => [...prevTransactions, transactionWithId]);
      calculateBalance();
      
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }

  useEffect(()=>{
      fetchTransactions();
  },[user])

  useEffect(()=>{
    calculateBalance()
  },[transactions])

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   transactionsArray.push(doc.data());
      // });
      querySnapshot.forEach((doc) => {
        transactionsArray.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTransactions(transactionsArray);
      console.log("Transaction array", transactionsArray)
      // toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
  })

  return (
    <div>
      <Header/>
      {loading ? (<Loader/>) : <> 
        <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        onResetBalance={resetBalance}
        />

        {transactions.length > 0 ? <ChartComponent sortedTransactions={sortedTransactions} /> : <NoTransactions/>} 

        <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
            />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} />
      </>
      }
    </div>
  )
}

export default Dashboard 