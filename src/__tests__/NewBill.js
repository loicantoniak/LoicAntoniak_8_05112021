import { fireEvent, screen } from "@testing-library/dom";
import firebase from "../__mocks__/firebase.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

const onNavigate = () => {
  return;
};

describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });

  describe("When I'm on NewBill Page", () => {
    describe("when I want to fill in the NewBill form", () => {
      describe("And I submit a valid bill form", () => {
        test("then a bill is created", async () => {
          const html = NewBillUI();
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              type: "Employee",
              email: "johndoe@email.com",
            })
          );
          document.body.innerHTML = html;
          const newBill = new NewBill({
            document,
            onNavigate,
            firestore: null,
            localStorage: window.localStorage,
          });
          const submit = screen.getByTestId("form-new-bill");
          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
          newBill.createBill = (newBill) => newBill;
          document.querySelector(`input[data-testid="expense-name"]`).value =
            "testValidBill";
          document.querySelector(`input[data-testid="datepicker"]`).value =
            "2021-12-03";
          document.querySelector(`select[data-testid="expense-type"]`).value =
            "Restaurants et bars";
          document.querySelector(`input[data-testid="amount"]`).value = 150;
          document.querySelector(`input[data-testid="vat"]`).value = "20";
          document.querySelector(`input[data-testid="pct"]`).value = 50;
          document.querySelector(`textarea[data-testid="commentary"]`).value =
            "";
          newBill.fileUrl = "https://test.jpg";
          newBill.fileName = "test.jpg";
          submit.addEventListener("click", handleSubmit);
          fireEvent.click(submit);
          expect(handleSubmit).toHaveBeenCalled();
        });
      });

      describe("And I upload a image file", () => {
        test("Then the file handler should show a file", () => {
          document.body.innerHTML = NewBillUI();
          const newBill = new NewBill({
            document,
            onNavigate,
            firestore: null,
            localStorage: window.localStorage,
          });
          const handleChangeFile = jest.fn(() => newBill.handleChangeFile);
          const inputFile = screen.getByTestId("file");
          inputFile.addEventListener("change", handleChangeFile);
          fireEvent.change(inputFile, {
            target: {
              files: [
                new File(["testFile"], "testFile", { type: "image/jpg" }),
              ],
            },
          });
          const numberOfFile = screen.getByTestId("file").files.length;
          expect(numberOfFile).toEqual(1);
        });
      });
    });
  });
});

describe("Given I am a user connected as an Employee", () => {
  describe("When I submit new bill", () => {
    test("POST bill to mock API", async () => {
      const postSpy = jest.spyOn(firebase, "post");
      const newBill = {
        pct: 20,
        amount: 200,
        email: "a@a",
        name: "test post",
        vat: "40",
        fileName: "testImage.jpg",
        date: "2002-02-02",
        commentary: "test2",
        type: "Restaurants et bars",
        fileUrl: '"https://test.fileUrl.jpg"',
      };
      const postBill = await firebase.post(newBill);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postBill).toBe(newBill);
    });
  });
});
