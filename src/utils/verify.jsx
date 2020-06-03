/**
 * Created by smart-yc
 * 校验规则
 */
// 标题
export function verifyTitle(rule, value) {
    let result = ''
    if (value) {
        if (value.length > 12) {
            result = '长度不能超过12位！'
        } else {
            const regExp = /[`~!@#$%^&*()_+<>?:"{},\/;'[\]]/im;
            if (regExp.test(value)) {
                result = '禁止填入非法字符'
            } else {
                result = ''
            }
        }
    } else {
        result = ''
    }
    return result;
}

export function verifyTitleBottom(rule, value) {
    let result = ''
    if (value) {
        if (value.length > 50) {
            result = '长度不能超过50位！'
        } 
    } else {
        result = ''
    }
    return result;
}

// 图片
export function verifyFile(rule, e) {
    // 检查图片类型,只能上传三种图片格式
    let result = ''
    if (e) {
        const isJPG = e.file.type === 'image/jpeg';
        const isPNG = e.file.type === 'image/png';
        const isBMP = e.file.type === 'image/jpg';
        const isGIF = e.file.type === 'image/gif';
        const isPic = isJPG || isPNG || isBMP || isGIF;
        if (!isPic) {
            result = '上传图片不能为空';
        } else {
            result = '';
        }
    } else {
        result = '';
    }
    return result
}
