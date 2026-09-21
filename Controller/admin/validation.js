

export class Validation {

    isRequired(inputValue, idELEerror, messageErr) {
        //kiểm tra so sánh với chuỗi rỗng ""
        if (inputValue == "") {
            //!chuỗi bị rỗng
            document.querySelector(idELEerror).innerHTML = messageErr

            return false //!dữ liệu sai, không hợp lệ
            // console.log("code không được thực hiện")
        }

        //? dữ liệu hợp lệ
        document.querySelector(idELEerror).innerHTML = ""
        return true
    }

    isID(arraySP, inputValue, idELEerror, messageErr) {
        //kiểm tra mã có bị trùng không

        let isMaTrung = arraySP.some((sv) => {
            return sv.maSinhVien == inputValue //sinh viên trùng mã
        })

        if (isMaTrung) {
            //mã trùng
            document.querySelector(idELEerror).innerHTML = messageErr
            return false //!thông báo mã trùng
        }

        document.querySelector(idELEerror).innerHTML = ""
        return true
    }

    isName(inputValue, idELEerror, messageErr) {
        // chuỗi Regex
        let format = /^(?!.*\d)(?!.* {2,})[\p{L}]+(?: [\p{L}]+)*$/u;
        if (inputValue.match(format)) {
            //hợp lệ //true
            document.querySelector(idELEerror).innerHTML = ""
            return true
        }

        document.querySelector(idELEerror).innerHTML = messageErr
        return false //!dữ liệu sai, không hợp lệ

    }


}