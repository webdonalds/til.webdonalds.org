import { Form } from "remix";

export default function AdminIndex() {
  return (
    <>
      <p className="text-4xl font-bold text-gray-900">관리자 메뉴</p>
      <div className="py-8">
        <Form action="/callbacks/logout" method="post">
          <button
            className="px-4 py-2 bg-red-500 shadow-lg shadow-red-500/50 rounded-lg font-bold text-white hover:opacity-75 transition">
            로그아웃
          </button>
        </Form>
      </div>
    </>
  );
}
