import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";

interface Budget {
  id: string;
  name: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  remainingAmount: number;
}

interface BudgetTask {
  id: string;
  budgetId: string;
  name: string;
  amount: number;
  completed: boolean;
}

const BudgetTracking: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [tasks, setTasks] = useState<BudgetTask[]>([]);
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetStartDate, setNewBudgetStartDate] = useState("");
  const [newBudgetEndDate, setNewBudgetEndDate] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskAmount, setNewTaskAmount] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (selectedBudget) {
      fetchTasks(selectedBudget);
    }
  }, [selectedBudget]);

  const fetchBudgets = async () => {
    const querySnapshot = await getDocs(collection(db, "budgets"));
    const fetchedBudgets: Budget[] = [];
    querySnapshot.forEach((doc) => {
      fetchedBudgets.push({ id: doc.id, ...doc.data() } as Budget);
    });
    setBudgets(fetchedBudgets);
  };

  const fetchTasks = async (budgetId: string) => {
    const q = query(
      collection(db, "budgetTasks"),
      where("budgetId", "==", budgetId),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    const fetchedTasks: BudgetTask[] = [];
    querySnapshot.forEach((doc) => {
      fetchedTasks.push({ id: doc.id, ...doc.data() } as BudgetTask);
    });
    setTasks(fetchedTasks);
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = {
      name: newBudgetName,
      totalAmount: parseFloat(newBudgetAmount),
      startDate: newBudgetStartDate,
      endDate: newBudgetEndDate,
      remainingAmount: parseFloat(newBudgetAmount),
    };
    const docRef = await addDoc(collection(db, "budgets"), newBudget);
    setBudgets([...budgets, { id: docRef.id, ...newBudget }]);
    setNewBudgetName("");
    setNewBudgetAmount("");
    setNewBudgetStartDate("");
    setNewBudgetEndDate("");
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;

    const newTask = {
      budgetId: selectedBudget,
      name: newTaskName,
      amount: parseFloat(newTaskAmount),
      completed: false,
    };
    await addDoc(collection(db, "budgetTasks"), newTask);
    setTasks([...tasks, { id: Date.now().toString(), ...newTask }]);
    setNewTaskName("");
    setNewTaskAmount("");
  };

  const handleCompleteTask = async (taskId: string, completed: boolean) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const budgetToUpdate = budgets.find(
      (budget) => budget.id === selectedBudget
    );
    if (!budgetToUpdate) return;

    const newRemainingAmount = completed
      ? budgetToUpdate.remainingAmount - taskToUpdate.amount
      : budgetToUpdate.remainingAmount + taskToUpdate.amount;

    await updateDoc(doc(db, "budgetTasks", taskId), { completed });
    await updateDoc(doc(db, "budgets", selectedBudget), {
      remainingAmount: newRemainingAmount,
    });

    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completed } : task))
    );
    setBudgets(
      budgets.map((budget) =>
        budget.id === selectedBudget
          ? { ...budget, remainingAmount: newRemainingAmount }
          : budget
      )
    );
  };

  const handleIncreaseBudget = async (amount: number) => {
    if (!selectedBudget) return;

    const budgetToUpdate = budgets.find(
      (budget) => budget.id === selectedBudget
    );
    if (!budgetToUpdate) return;

    const newTotalAmount = budgetToUpdate.totalAmount + amount;
    const newRemainingAmount = budgetToUpdate.remainingAmount + amount;

    await updateDoc(doc(db, "budgets", selectedBudget), {
      totalAmount: newTotalAmount,
      remainingAmount: newRemainingAmount,
    });

    setBudgets(
      budgets.map((budget) =>
        budget.id === selectedBudget
          ? {
              ...budget,
              totalAmount: newTotalAmount,
              remainingAmount: newRemainingAmount,
            }
          : budget
      )
    );
  };

  const selectedBudgetData = budgets.find(
    (budget) => budget.id === selectedBudget
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion du budget</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Créer un nouveau budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div>
              <Label htmlFor="budgetName">Nom du budget</Label>
              <Input
                id="budgetName"
                value={newBudgetName}
                onChange={(e) => setNewBudgetName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="budgetAmount">Montant total</Label>
              <Input
                id="budgetAmount"
                type="number"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="budgetStartDate">Date de début</Label>
              <Input
                id="budgetStartDate"
                type="date"
                value={newBudgetStartDate}
                onChange={(e) => setNewBudgetStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="budgetEndDate">Date de fin</Label>
              <Input
                id="budgetEndDate"
                type="date"
                value={newBudgetEndDate}
                onChange={(e) => setNewBudgetEndDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Créer le budget</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélectionner un budget</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
          >
            <option value="">Sélectionner un budget</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {selectedBudgetData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{selectedBudgetData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Budget total: {selectedBudgetData.totalAmount} €</p>
            <p>Montant restant: {selectedBudgetData.remainingAmount} €</p>
            <p>
              Période:{" "}
              {new Date(selectedBudgetData.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedBudgetData.endDate).toLocaleDateString()}
            </p>
            <Progress
              value={
                (selectedBudgetData.remainingAmount /
                  selectedBudgetData.totalAmount) *
                100
              }
              className="mt-2"
            />
            <Button onClick={() => handleIncreaseBudget(1000)} className="mt-4">
              Augmenter le budget de 1000 €
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedBudget && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ajouter une tâche</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label htmlFor="taskName">Nom de la tâche</Label>
                <Input
                  id="taskName"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="taskAmount">Montant</Label>
                <Input
                  id="taskAmount"
                  type="number"
                  value={newTaskAmount}
                  onChange={(e) => setNewTaskAmount(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Ajouter la tâche</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedBudget && (
        <Card>
          <CardHeader>
            <CardTitle>Tâches du budget</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between">
                  <span>
                    {task.name} - {task.amount} €
                  </span>
                  <Button
                    onClick={() => handleCompleteTask(task.id, !task.completed)}
                    variant={task.completed ? "secondary" : "default"}
                  >
                    {task.completed ? "Annuler" : "Marquer comme terminée"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetTracking;
