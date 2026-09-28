# Phân tích ý tưởng AI hỗ trợ đi xe buýt đúng giờ

## AI for Everyday Life Hackathon 2026

### Báo cáo phân tích vòng 1

## Kết luận quan trọng nhất

Ý tưởng của bạn có nỗi đau thật và rất phù hợp chủ đề cuộc thi. Tuy nhiên, nếu trình bày là:

> “Ứng dụng dùng GPS để theo dõi từng xe buýt trên bản đồ”

thì sẽ gặp vấn đề lớn: chức năng này đã tồn tại ở Đà Nẵng thông qua DanaBus. DanaBus hiện đã hỗ trợ tra tuyến, xem vị trí xe theo thời gian thực và dự báo xe đến trạm; thông tin chính thức còn cho biết toàn bộ xe buýt đang hoạt động đã được gắn GPS.

Nguồn: [DanaBus – thông tin chính thức](https://www.danangbus.vn/tin-tuc/tin-tuc/danabus--nguoi-ban-dong-hanh-thong-minh-cua-hanh-khach-xe-buyt-da-nang-5727.html)

Điểm yếu của DanaBus mà chính đơn vị vận hành cũng thừa nhận là độ chính xác ETA, tính ổn định dữ liệu thời gian thực và trải nghiệm sử dụng.

Nguồn: [DanaBus – các nội dung cần tiếp tục hoàn thiện](https://www.danangbus.vn/tin-tuc/tin-tuc/danabus--nguoi-ban-dong-hanh-thong-minh-cua-hanh-khach-xe-buyt-da-nang-5727.html)

Vì vậy, hướng có tiềm năng hơn là:

> Không chỉ cho người dùng biết “xe đang ở đâu”, mà giúp họ quyết định “bây giờ có nên tiếp tục chờ, đi bộ sang trạm khác, đổi tuyến hay chọn phương án khác để chắc chắn không trễ học?”

Đây mới là phần có thể tạo khác biệt bằng AI.

## 1. Phân tích thể lệ cuộc thi

### Problem – 25%

Ý tưởng của bạn đang mạnh ở các điểm sau:

- Vấn đề xảy ra thường xuyên.
- Có trải nghiệm cá nhân chân thật.
- Nhóm người dùng rõ: sinh viên, công nhân, người không có phương tiện cá nhân.
- Hậu quả cụ thể: chờ lâu, lỡ xe, trễ học, trễ làm, mất niềm tin vào xe buýt.

Nhưng bạn cần bổ sung bằng chứng, không chỉ kể câu chuyện cá nhân:

- Một tuần bạn bị lỡ xe bao nhiêu lần?
- Trung bình phải chờ thêm bao nhiêu phút?
- Bao nhiêu người ở VKU gặp vấn đề tương tự?
- Họ đang dùng DanaBus, Google Maps hay hỏi người khác?
- Điểm nào khiến họ không tin dữ liệu hiện tại?

### Idea and Creativity – 30%

Đây là tiêu chí rủi ro nhất.

Theo ý tưởng ban đầu, AI chưa thực sự cần thiết. GPS, bản đồ và cảm biến không tự động biến một ứng dụng thành sản phẩm AI. Nếu chỉ hiển thị vị trí xe thì có thể bị xem là:

- Sao chép tính năng của DanaBus.
- Dùng AI theo kiểu gắn nhãn cho có.
- Chưa có điểm sáng tạo rõ ràng.

AI cần tham gia vào một quyết định khó, chẳng hạn:

- Dự đoán thời gian xe đến trạm trong điều kiện giao thông thực tế.
- Tính xác suất người dùng đến lớp đúng giờ.
- Phát hiện xe đang bị trễ bất thường hoặc dừng quá lâu.
- Đề xuất nên chờ, đi bộ sang trạm khác hay đổi tuyến.
- Cá nhân hóa theo lịch học, khoảng cách đi bộ và mức độ chấp nhận rủi ro của từng người.

### Feasibility – 20%

Điểm khả thi:

- GPS trên xe đã có sẵn.
- Không nhất thiết phải lắp cảm biến ở tất cả trạm.
- Có thể dùng geofencing: khi xe đi vào vùng bán kính quanh trạm, hệ thống xác định xe đã đến trạm.
- Có thể làm prototype bằng dữ liệu mô phỏng, không cần xây dựng hệ thống thật.

Điểm khó:

- Muốn có dữ liệu GPS trực tiếp phải được DanaBus hoặc cơ quan vận hành cho phép.
- Không thể cam kết dự báo chính xác nếu không có dữ liệu lịch sử.
- Dữ liệu giao thông, thời tiết và sự cố phải được tích hợp.
- AI không thể giải quyết dữ liệu bị mất, GPS lỗi hoặc xe không truyền tín hiệu.

### Presentation – 25%

Câu chuyện của bạn có tiềm năng rất tốt nếu đi theo hành trình:

1. Một sinh viên rời nhà.
2. Đến trạm và không biết xe đã đi qua chưa.
3. Chờ trong trạng thái không chắc chắn.
4. Lỡ xe, trễ học.
5. Ứng dụng giúp biến sự không chắc chắn thành một quyết định rõ ràng.

Không nên bắt đầu bằng cảm biến, server hay bản đồ. Hãy bắt đầu bằng cảm giác:

> “Tôi không sợ chờ xe. Tôi sợ chờ nhầm.”

## 2. Phân rã pain point thực sự

Pain point không đơn giản là “không biết xe buýt đang ở đâu”. Nó gồm năm lớp:

1. **Thiếu thông tin:** Không biết xe đã đi qua trạm chưa.
2. **Dữ liệu không đáng tin:** ETA có thể sai do kẹt xe, đèn đỏ, hỏng xe hoặc dừng lâu.
3. **Không biết hành động tiếp theo:** Tiếp tục chờ hay đổi phương án?
4. **Chi phí cơ hội:** Thời gian chờ có thể làm trễ học, trễ làm.
5. **Mất niềm tin:** Người dùng dần bỏ xe buýt vì cảm thấy quá bất định.

Nhu cầu thật của người dùng có thể viết thành:

> “Tôi cần biết thời điểm rời nhà và hành động tiếp theo có khả năng cao nhất giúp tôi đến nơi đúng giờ, thay vì chỉ nhìn một biểu tượng xe buýt trên bản đồ.”

## 3. Đánh giá ý tưởng cảm biến ở trạm

Ý tưởng cảm biến là hợp lý về mặt suy nghĩ ban đầu, nhưng chưa phù hợp để đưa vào phiên bản thi.

### Vì sao chưa nên dùng cảm biến?

- Phải lắp đặt và bảo trì tại hàng trăm trạm.
- Thiết bị chịu nắng, mưa, bụi, va chạm và mất điện.
- Cần kết nối mạng và nguồn điện.
- Chi phí triển khai cao.
- Chưa giải quyết được vấn đề dự báo xe sẽ đến sau bao lâu.
- Nếu xe đã có GPS thì cảm biến ở trạm là trùng lặp.

Cách đơn giản hơn là:

1. GPS trên xe gửi tọa độ theo chu kỳ.
2. Hệ thống tạo vùng địa lý quanh từng trạm.
3. Khi xe đi vào vùng đó, AI ghi nhận “đã đến trạm”.
4. Nếu xe dừng quá lâu hoặc tín hiệu biến mất, hệ thống cảnh báo dữ liệu không chắc chắn.

Bạn cũng không nên nói GPS giống “địa chỉ IP”. Mỗi xe có thể có một thiết bị định danh riêng, nhưng vị trí của nó thay đổi liên tục theo tọa độ GPS.

## 4. Hướng sản phẩm nên chuyển sang

Tên mô tả tạm thời:

> **AI Bus Reliability Assistant – Trợ lý đi xe buýt đúng giờ**

Chức năng cốt lõi:

- Người dùng nhập điểm đến và giờ cần có mặt.
- Ứng dụng biết vị trí hiện tại, trạm gần nhất và các tuyến phù hợp.
- AI dự đoán thời gian xe đến theo khoảng, ví dụ “8–12 phút”, thay vì đưa ra một con số giả chính xác.
- AI hiển thị mức độ tin cậy.
- Nếu xe trễ hoặc đã đi qua, ứng dụng đề xuất phương án thay thế.
- Ứng dụng cảnh báo thời điểm cần rời nhà.
- Người dùng có thể đặt mục tiêu: “Tôi phải có mặt ở VKU trước 7:30”.

Ví dụ thông báo trong mockup:

> “Xe tuyến 05 còn khoảng 9–13 phút, độ tin cậy 78%. Nếu bạn tiếp tục chờ, xác suất đến lớp trước 7:30 là 61%. Đi bộ 6 phút đến trạm kế tiếp giúp tăng xác suất lên 84%.”

Các con số trên chỉ là ví dụ cho mockup, không nên trình bày như dữ liệu thật.

## 5. AI nên hoạt động như thế nào?

### Dữ liệu đầu vào

- Vị trí GPS hiện tại của xe.
- Lịch sử thời gian di chuyển từng đoạn đường.
- Thời gian xe dừng tại từng trạm.
- Tình trạng giao thông.
- Thời tiết.
- Khung giờ cao điểm.
- Sự kiện đặc biệt hoặc tai nạn nếu có.
- Vị trí và thời gian cần đến của người dùng.

### Các mô hình AI

| Thành phần | Vai trò |
|---|---|
| ETA Prediction | Dự đoán thời gian xe đến trạm. |
| Anomaly Detection | Phát hiện xe đứng yên quá lâu, đi sai tuyến hoặc mất tín hiệu. |
| Personalized Decision Engine | Đề xuất lựa chọn phù hợp từng người. |
| Natural Language Assistant | Giải thích ngắn gọn vì sao nên chờ hoặc đổi tuyến. |

Điểm quan trọng: chatbot không nên là phần trung tâm. Phần AI có giá trị nhất là mô hình dự báo và ra quyết định dựa trên dữ liệu.

## 6. Điểm khác biệt với DanaBus

Không nên tuyên bố rằng ứng dụng của bạn thay thế DanaBus. Hãy định vị như một lớp thông minh bổ sung:

| DanaBus | Ý tưởng của bạn |
|---|---|
| Xe đang ở đâu? | Tôi nên làm gì tiếp theo? |
| Tra tuyến | Tối ưu khả năng đến đúng giờ |
| ETA một chiều | ETA kèm mức độ tin cậy |
| Thông tin chung | Khuyến nghị cá nhân hóa |
| Theo dõi xe | Quản lý rủi ro trễ học hoặc trễ làm |

Đây là cách tránh bị xem là sao chép.

## 7. Top 0,1% trong lĩnh vực này sẽ nghĩ gì?

Họ sẽ không bắt đầu bằng câu hỏi:

> “Làm thế nào để theo dõi xe buýt?”

Họ sẽ hỏi:

> “Tại sao người dùng vẫn không cảm thấy an tâm dù đã có GPS?”

Câu trả lời có thể là:

- GPS không đồng nghĩa với dự báo chính xác.
- Biết xe ở đâu không đồng nghĩa với biết mình nên làm gì.
- Người dùng cần một quyết định, không cần thêm một bản đồ.
- Giá trị thật nằm ở việc giảm thời gian chờ vô ích và giảm xác suất trễ giờ.

Họ cũng sẽ xác định một chỉ số thành công rất rõ:

> “Ứng dụng giảm được bao nhiêu phút chờ không cần thiết và tăng bao nhiêu xác suất đến đúng giờ?”

## 8. Góc nhìn mới hoàn toàn

Cách nhìn ban đầu:

> “Tôi muốn làm app theo dõi xe buýt bằng GPS.”

Cách nhìn mạnh hơn:

> “Tôi muốn xây dựng một hệ thống giúp người đi xe buýt ra quyết định đúng trong điều kiện giao thông không chắc chắn.”

Hoặc ngắn gọn hơn:

> “Từ ứng dụng theo dõi xe buýt thành trợ lý giảm rủi ro trễ giờ.”

Đây là thay đổi quan trọng nhất của đề tài.

## 9. Đánh giá sơ bộ hiện tại

Nếu giữ ý tưởng ban đầu:

| Tiêu chí | Đánh giá sơ bộ |
|---|---:|
| Problem | 8/10 |
| Creativity | 4/10 |
| Feasibility | 5/10 |
| Presentation | 6/10 |

Nếu chuyển sang “AI dự báo độ tin cậy và đề xuất hành động”:

| Tiêu chí | Đánh giá sơ bộ |
|---|---:|
| Problem | 9/10 |
| Creativity | 8/10 |
| Feasibility | 7/10 |
| Presentation | 8–9/10 |

Đây là đánh giá sơ bộ, chưa phải kết luận cuối cùng.

## 10. Các câu hỏi cần trả lời

Mình chưa thể nói đã đạt 96% tự tin; hiện tại khoảng 65% vì còn thiếu dữ liệu thực tế. Bạn hãy trả lời ngắn từng câu:

1. Bạn thường đi từ khu vực nào đến VKU? Trạm xe buýt cụ thể nào bạn thường sử dụng?
2. Bạn thường đi tuyến xe nào?
3. Trong một tuần, bạn bị lỡ xe hoặc trễ học khoảng bao nhiêu lần?
4. Lần gần đây nhất xảy ra tình huống này như thế nào? Hãy kể lại theo mốc thời gian.
5. Bạn đã từng dùng DanaBus chưa? Nếu có, chính xác điều gì khiến bạn vẫn không giải quyết được vấn đề?
6. Người dùng mục tiêu đầu tiên nên chỉ là sinh viên VKU hay mở rộng cho công nhân và người dân Đà Nẵng?
7. Ứng dụng cần ưu tiên điều gì hơn: giảm thời gian chờ, tăng khả năng đến đúng giờ hay giảm cảm giác lo lắng?
8. Đội của bạn có thể làm mockup hoặc prototype bằng công cụ nào? Có ai biết thiết kế, lập trình, phân tích dữ liệu hoặc thuyết trình tiếng Anh không?
9. Bạn có khả năng phỏng vấn thêm 5–10 sinh viên đang đi xe buýt không?
10. Bạn muốn đề xuất một ứng dụng độc lập với DanaBus, hay một tính năng có thể tích hợp vào DanaBus?
11. Bạn có muốn giữ ý tưởng cảm biến phần cứng, hay chấp nhận chuyển sang phương án dùng dữ liệu GPS và AI?
12. Bạn muốn mình tiếp tục theo hướng xây dựng luôn bộ concept hoàn chỉnh gồm tên app, tagline, user journey, AI architecture, mockup và nội dung tối đa 15 slide bằng tiếng Anh không?

Sau khi bạn trả lời, mình sẽ tiếp tục vòng phân tích thứ hai và khóa lại: vấn đề trọng tâm, người dùng đầu tiên, điểm khác biệt, mô hình AI, phạm vi MVP và câu chuyện pitch.

## 11. Dữ liệu thực tế từ người dùng ban đầu

### Hồ sơ người dùng đầu tiên

| Nội dung | Dữ liệu hiện có |
|---|---|
| Người dùng | Sinh viên VKU |
| Hành trình | Từ nhà đi đến trạm xe buýt, chờ xe tại trạm có mái che và chỗ ngồi, sau đó đi đến trường |
| Tuyến sử dụng | Tuyến 6 và tuyến 13 |
| Tần suất vấn đề | Trung bình khoảng 2 lần trong những tuần có sử dụng xe buýt; không phải ngày nào cũng đi xe buýt |
| Ưu tiên chính | Giảm thời gian chờ |
| DanaBus | Đã từng sử dụng nhưng không hiệu quả |
| Định hướng sản phẩm | Ứng dụng độc lập với DanaBus |
| Công nghệ mong muốn | Kết hợp cảm biến và AI |

### Sự cố gần đây

Vào thứ Tư trong tuần này, người dùng dự kiến sẽ có chuyến xe vào khoảng 12h2x nhưng phải chờ đến 12:55 mới có chuyến xe. Khoảng thời gian cụ thể cần được xác nhận lại, nhưng tình huống cho thấy thời gian chờ thực tế có thể lệch đáng kể so với kỳ vọng.

### Insight quan trọng hơn

Trạm xe buýt có mái che và chỗ ngồi. Vì vậy, pain point chính không phải là sự khó chịu về thể chất khi đứng chờ. Pain point là:

> Người dùng đang ở một nơi tương đối thoải mái nhưng không biết mình sẽ phải ở đó thêm bao lâu.

Điều này làm thay đổi cách định vị sản phẩm. Ứng dụng không chỉ cần hiển thị vị trí xe; nó phải giúp sinh viên lấy lại quyền chủ động về thời gian.

## 12. Vấn đề trọng tâm đã được thu hẹp

### Problem statement đề xuất

> Sinh viên VKU phụ thuộc vào xe buýt tuyến 6 và 13 thường phải chờ tại trạm mà không có thông tin đủ đáng tin về chuyến nào sẽ đến trước và thời gian chờ thực tế là bao lâu. Khi thời gian xe đến lệch khỏi dự kiến, sinh viên có thể mất hàng chục phút chờ đợi và không biết nên tiếp tục chờ hay đổi phương án.

### Job to be done

> Khi đang chờ xe buýt đến VKU, tôi muốn biết tuyến 6 hay tuyến 13 có khả năng đến trước và tôi nên chờ thêm bao lâu, để giảm thời gian chờ mà vẫn có cơ hội đến trường đúng giờ.

### Câu hỏi trung tâm của sản phẩm

Không phải:

> “Xe buýt đang ở đâu?”

Mà là:

> “Trong các lựa chọn hiện có, tôi nên chờ chuyến nào và chờ đến thời điểm nào?”

## 13. Concept được điều chỉnh theo câu trả lời của bạn

### Định vị sản phẩm

Đây là một ứng dụng độc lập dành trước tiên cho sinh viên VKU đi tuyến 6 và 13. Ứng dụng dùng dữ liệu GPS, cảm biến xác nhận xe đi qua trạm và AI để dự báo thời gian chờ cũng như đề xuất lựa chọn tốt hơn giữa các tuyến.

### Cách kết hợp cảm biến và AI khả thi hơn

Không nên đặt cảm biến ở tất cả các trạm ngay từ đầu. Có thể đề xuất mô hình thử nghiệm theo từng bước:

1. Mỗi xe sử dụng dữ liệu GPS để xác định vị trí liên tục.
2. Một số trạm trọng điểm gần tuyến đi học của sinh viên được gắn cảm biến BLE công suất thấp hoặc thiết bị beacon có mã nhận diện riêng.
3. Thiết bị trên xe phát hiện beacon khi xe đi qua trạm; dữ liệu này được dùng để xác nhận thời điểm xe thực sự đến hoặc rời trạm.
4. AI kết hợp GPS, tín hiệu cảm biến, lịch sử di chuyển và tình trạng giao thông để tạo ra thời gian dự báo kèm mức độ tin cậy.
5. Nếu cảm biến mất tín hiệu, GPS và geofencing vẫn là phương án dự phòng.

Trong phần thi, cảm biến nên được trình bày như một lớp xác thực dữ liệu, không phải toàn bộ nền tảng. Như vậy, ý tưởng vẫn có phần cứng nhưng không bị phụ thuộc hoàn toàn vào một hệ thống khó triển khai.

### AI tạo giá trị ở đâu?

- Dự đoán thời gian xe tuyến 6 và 13 đến trạm theo khoảng thời gian.
- So sánh khả năng tuyến 6 hoặc 13 đến trước.
- Phát hiện thời gian xe đến đang lệch bất thường so với lịch sử.
- Nhận biết tín hiệu cảm biến và GPS có mâu thuẫn hay không.
- Gửi cảnh báo khi người dùng đã chờ quá lâu.
- Đề xuất tiếp tục chờ tuyến hiện tại hay chuyển sang lựa chọn khác.

Ví dụ:

> “Tuyến 13 có khả năng đến trong 7–10 phút với độ tin cậy 82%. Tuyến 6 có thể đến trong 5–18 phút nhưng độ tin cậy thấp hơn. Nên tiếp tục chờ tuyến 13 nếu mục tiêu là giảm thời gian chờ không chắc chắn.”

Các con số trong ví dụ chỉ phục vụ mockup, không phải dữ liệu thực tế.

## 14. Phạm vi MVP phù hợp với cuộc thi

Để tránh biến đề tài thành dự án giao thông quá lớn, MVP nên giới hạn ở:

- Một nhóm sinh viên VKU.
- Hai tuyến xe: tuyến 6 và tuyến 13.
- Một số trạm có nhiều sinh viên sử dụng.
- Một điểm đến chính là VKU.
- Một bài toán chính: giảm thời gian chờ.

Prototype có thể gồm năm màn hình:

1. Chọn trạm và giờ cần đến trường.
2. So sánh tuyến 6 và tuyến 13.
3. Hiển thị ETA theo khoảng thời gian và độ tin cậy.
4. Cảnh báo “xe đã đi qua”, “xe đang trễ” hoặc “nên tiếp tục chờ”.
5. Màn hình giải thích vì sao AI đưa ra khuyến nghị.

Prototype không cần có dữ liệu GPS thật. Đội có thể sử dụng dữ liệu mô phỏng cho phần trình bày, miễn là nói rõ đây là bản demo ý tưởng.

## 15. Chỉ số thành công đề xuất

Ứng dụng nên được đánh giá bằng các chỉ số cụ thể:

- Giảm số phút chờ trung bình.
- Giảm số lần người dùng chờ quá lâu nhưng không biết nên đổi phương án.
- Tăng tỷ lệ người dùng chọn được chuyến có thời gian chờ thấp hơn.
- Tăng mức độ tin tưởng vào thông tin xe buýt.
- Tăng xác suất đến VKU đúng giờ.

Chỉ số mạnh nhất để đưa vào pitch là:

> Số phút chờ không cần thiết được giảm mỗi chuyến đi.

## 16. Các rủi ro cần xử lý trong phần Q&A

### Rủi ro 1: Cảm biến quá đắt hoặc khó bảo trì

Giải pháp trả lời: chỉ thử nghiệm cảm biến ở một số trạm trọng điểm gần VKU, dùng GPS làm dữ liệu nền và cảm biến làm lớp xác thực. Không đề xuất triển khai toàn thành phố ngay từ đầu.

### Rủi ro 2: Không có quyền truy cập dữ liệu DanaBus

Giải pháp trả lời: prototype dùng dữ liệu mô phỏng; giai đoạn sản phẩm thật sẽ cần hợp tác với đơn vị vận hành xe buýt hoặc cơ quan quản lý giao thông.

### Rủi ro 3: AI không thể chính xác nếu dữ liệu ít

Giải pháp trả lời: giai đoạn đầu dùng mô hình lai gồm quy tắc, dữ liệu lịch sử và machine learning; hệ thống hiển thị khoảng dự báo và độ tin cậy thay vì giả vờ chính xác tuyệt đối.

### Rủi ro 4: Ứng dụng độc lập nhưng vẫn giống DanaBus

Giải pháp trả lời: DanaBus trả lời “xe đang ở đâu”, còn ứng dụng này trả lời “sinh viên nên chọn tuyến nào và nên chờ bao lâu để giảm thời gian chờ”.

## 17. Những câu hỏi còn cần làm rõ để đạt mức tự tin cao hơn

Để hoàn thiện concept ở mức khoảng 96%, còn cần xác nhận:

1. Tên hoặc khu vực của trạm bạn thường sử dụng; nếu không muốn nêu địa chỉ cụ thể, có thể mô tả khu vực gần nhà.
2. Chuyến dự kiến vào khoảng 12h2x chính xác là mấy giờ và chuyến đến lúc 12:55 thuộc tuyến 6 hay tuyến 13?
3. Khi bạn nói DanaBus không hiệu quả, vấn đề chính là ETA sai, không hiển thị xe, ứng dụng khó dùng, hay bạn không biết nên chọn tuyến nào?
4. Tuyến 6 và tuyến 13 có cùng trạm đón hay bạn phải đi đến hai trạm khác nhau?
5. Đội có bao nhiêu thành viên và ai phụ trách thiết kế, nghiên cứu người dùng, công nghệ hoặc thuyết trình tiếng Anh?
6. Bạn muốn prototype mô phỏng dữ liệu cảm biến, hay muốn làm một demo nhỏ có một beacon/cảm biến thật?

## Kết luận vòng 2

Ý tưởng đã được thu hẹp từ “ứng dụng theo dõi xe buýt bằng GPS” thành:

> **Một trợ lý AI độc lập cho sinh viên VKU, dùng GPS và cảm biến để xác nhận xe đi qua trạm, sau đó dự báo và đề xuất lựa chọn giúp giảm thời gian chờ giữa tuyến 6 và tuyến 13.**

Đây là hướng phù hợp hơn với cuộc thi vì có người dùng cụ thể, nỗi đau cá nhân rõ, AI có vai trò thực chất, cảm biến được sử dụng có mục đích và MVP có thể giới hạn trong phạm vi nhỏ.

## 18. Kiểm tra lại tính thực tiễn và bài toán kích cầu

### Lo ngại của bạn là chính xác

Từ góc nhìn sản phẩm, ứng dụng hiện tại chủ yếu giải quyết bài toán **giữ chân những người đã đi xe buýt**, chứ chưa giải quyết bài toán **thuyết phục người đang đi xe máy chuyển sang xe buýt**.

Nếu người dùng không có ý định sử dụng xe buýt, một ứng dụng chỉ giúp họ theo dõi xe tốt hơn có thể không đủ lý do để họ cài đặt và sử dụng.

> Ứng dụng theo dõi xe buýt là sản phẩm tối ưu hóa trải nghiệm của người dùng hiện tại, chưa phải là sản phẩm tạo ra nhu cầu mới.

### Bối cảnh thực tế ở Đà Nẵng

Một bài viết trên Cổng Thông tin điện tử Chính phủ từng ghi nhận rằng tỷ lệ người dân đi xe buýt ở Đà Nẵng còn thấp do thói quen sử dụng xe máy cá nhân, mạng lưới chưa phủ rộng và một số điểm dừng còn xa hoặc khó tiếp cận. [Nguồn: Báo Điện tử Chính phủ](https://baochinhphu.vn/chi-gan-140-ty-dong-tro-gia-xe-buyt-nhung-ket-qua-khong-nhu-ky-vong-10222072116093261.htm)

Một nghiên cứu năm 2025 cũng ghi nhận ý định sử dụng xe buýt của nhóm được khảo sát còn thấp, trong khi sự tiện lợi, an toàn, giá vé và độ đúng giờ ảnh hưởng đáng kể đến quyết định sử dụng. [Nguồn: Tạp chí Khoa học Trường Đại học Đông Á](https://js.donga.edu.vn/index.php/daujs/article/view/485)

Điều này xác nhận trực giác của bạn: vấn đề không chỉ là “không biết xe đang ở đâu”, mà là xe buýt chưa thắng được xe máy ở những tiêu chí người dùng quan tâm nhất.

### Cần thận trọng với giả định về việc cắt giảm chuyến

Chưa nên đưa vào bài thi khẳng định rằng chính phủ cắt giảm chuyến xe buýt để giảm ùn tắc hoặc tai nạn nếu chưa có văn bản cụ thể chứng minh điều đó.

Các thông tin chính thức gần đây cho thấy:

- Một thông báo điều chỉnh biểu đồ chạy xe tháng 3/2026 nêu nguyên nhân là biến động giá xăng dầu đối với một số tuyến không trợ giá. [Nguồn: DanaBus](https://www.danangbus.vn/news/news/thong-bao-dieu-chinh-bieu-do-chay-xe-cua-mot-so-tuyen-buyt-khong-tro-gia-5593.html)
- Một số thay đổi khác là điều chỉnh tạm thời lộ trình vận hành, trong đó có tuyến 6 và tuyến 13. [Nguồn: DanaBus](https://www.danangbus.vn/tin-tuc/tin-tuc/thong-bao-dieu-chinh-tam-thoi-lo-trinh-chay-xe-doi-voi-cac-tuyen-buyt-tren-dia-ban-thanh-pho-da-nang-5632.html)
- Thành phố vẫn có định hướng mở rộng mạng lưới xe buýt và tăng khả năng tiếp cận trong bán kính khoảng 500 m ở khu vực trung tâm. [Nguồn: Cổng Thông tin điện tử Đà Nẵng](https://danang.gov.vn/vi/w/den-nam-2030-co-28-tuyen-xe-buytdi)
- Đà Nẵng đang triển khai chuyển đổi xe buýt diesel sang xe buýt điện để giảm phát thải và hiện đại hóa giao thông công cộng. [Nguồn: DanaBus](https://www.danangbus.vn/tin-tuc/tin-tuc/da-nang-day-manh-trien-khai-xe-buyt-dien-tren-cac-tuyen-xe-buyt-tro-gia-5726.html)

Kết luận an toàn hơn là: **tần suất và mô hình vận hành có thể thay đổi vì nhiều yếu tố kinh tế, kỹ thuật và quy hoạch; người dùng càng cần thông tin đáng tin khi khoảng cách giữa các chuyến dài.**

Xe buýt điện hỗ trợ mục tiêu giảm tiếng ồn và phát thải, nhưng tự nó không giải quyết được tính linh hoạt, thời gian chờ và khả năng đi từ cửa nhà đến đúng địa điểm như xe máy.

## 19. Câu hỏi lớn hơn không phải là “AI dùng ở đâu?”

Câu hỏi đúng phải là:

> “Điều gì khiến một người chọn xe máy thay vì xe buýt trong một chuyến đi cụ thể?”

Xe máy thắng xe buýt ở các điểm:

- Đi từ cửa nhà đến cửa trường.
- Không phải chờ.
- Tự do thay đổi giờ đi.
- Có thể đổi đường bất kỳ lúc nào.
- Không phụ thuộc vào lịch vận hành.

Vì vậy, không thể thuyết phục người dân chỉ bằng thông điệp “xe buýt xanh hơn” hoặc “xe buýt an toàn hơn”. Người dùng sẽ hỏi:

> “Tôi có đến nơi đúng lúc không, và tôi phải hy sinh bao nhiêu thời gian để làm điều đó?”

Sản phẩm phải làm cho câu trả lời này đủ rõ ràng và đủ đáng tin trong từng chuyến đi.

## 20. Hướng dự án nên chuyển sang

### Từ Bus Tracking sang AI Commute Choice

Hướng mới không chỉ theo dõi xe buýt, mà giúp sinh viên quyết định **hôm nay có nên đi xe buýt hay không**.

Mô tả đề xuất:

> Một trợ lý AI dành cho sinh viên VKU, giúp so sánh xe buýt tuyến 6, tuyến 13 và phương án cá nhân theo thời gian đến, chi phí, thời tiết, độ tin cậy và mức độ thuận tiện; sau đó hướng dẫn người dùng thực hiện lựa chọn tốt nhất cho chuyến đi đó.

Điểm khác biệt quan trọng:

> Ứng dụng không ép người dùng chọn xe buýt. Nếu xe máy thực sự tốt hơn trong tình huống đó, AI phải nói thẳng. Nếu xe buýt là lựa chọn hợp lý hơn, ứng dụng phải chứng minh bằng dữ liệu.

Một hệ thống luôn cố thuyết phục người dùng đi xe buýt sẽ nhanh chóng bị xem là quảng cáo. Một hệ thống trung thực về cả hai lựa chọn sẽ tạo niềm tin hơn.

## 21. AI thực sự dùng để làm gì?

### Dự báo độ tin cậy của xe buýt

AI không chỉ dự đoán xe đến sau bao nhiêu phút, mà dự đoán xác suất dự báo đó đúng.

### So sánh phương án đi lại

AI so sánh xe buýt với phương án cá nhân dựa trên:

- Thời gian từ cửa nhà đến VKU.
- Thời gian chờ.
- Thời gian đi trên xe.
- Khả năng kẹt xe.
- Chi phí.
- Thời tiết.
- Thời gian và khó khăn khi gửi xe.

### Cá nhân hóa theo hoàn cảnh

Một sinh viên có thể ưu tiên rẻ và an toàn. Người khác ưu tiên nhanh. Người có tiết học lúc 7:00 sẽ chấp nhận rủi ro thấp hơn người chỉ đi chơi.

### Tạo niềm tin qua sự minh bạch

Ứng dụng phải giải thích vì sao hôm nay nên chọn tuyến 6, vì sao tuyến 13 rủi ro hơn, dữ liệu được cập nhật cách đây bao lâu và khi nào hệ thống không đủ dữ liệu để dự báo.

AI trong dự án này không nhất thiết phải là chatbot. Phần cốt lõi là dự báo, so sánh và ra quyết định.

## 22. Ba hướng chiến lược

| Hướng | Giá trị | Điểm yếu | Đánh giá |
|---|---|---|---|
| Theo dõi xe buýt cho người đang đi xe buýt | Giải quyết đúng pain point cá nhân | Quy mô người dùng nhỏ, dễ trùng DanaBus | Chỉ nên là một tính năng |
| AI giúp sinh viên quyết định xe buýt hay xe máy trong từng chuyến | Có khả năng kích cầu và tạo tác động hành vi | Cần dữ liệu so sánh nhiều phương án | **Nên chọn** |
| AI tối ưu lịch và nhu cầu cho đơn vị vận hành | Tác động hệ thống lớn | Cần dữ liệu và hợp tác cơ quan quản lý | Có thể là hướng phát triển sau này |

## 23. Người dùng mục tiêu không nên là “tất cả công dân”

Hãy chọn nhóm có khả năng chuyển đổi cao nhất:

- Sinh viên VKU.
- Không có xe máy hoặc không luôn có xe máy để sử dụng.
- Sống trên hành lang tuyến 6 hoặc tuyến 13.
- Cần đến trường vào giờ tương đối cố định.
- Nhạy cảm với chi phí.
- Đã từng đi xe buýt hoặc đang cân nhắc đi xe buýt.

Đây là nhóm người dùng ban đầu hợp lý. Khi ứng dụng chứng minh được giá trị với nhóm này, mới có cơ sở mở rộng sang sinh viên khác, công nhân hoặc người dân.

## 24. Kế hoạch kiểm chứng trước khi làm sản phẩm

Bạn nên phỏng vấn hai nhóm:

- 5 sinh viên đang đi xe buýt.
- 5 sinh viên thường đi xe máy nhưng từng cân nhắc xe buýt.

Các câu hỏi nên hỏi:

1. Lần gần nhất bạn chọn xe máy thay vì xe buýt là vì lý do gì?
2. Nếu biết chính xác xe buýt sẽ đến trong 8 phút với độ tin cậy 85%, bạn có đổi lựa chọn không?
3. Chậm bao nhiêu phút thì bạn sẽ bỏ ý định đi xe buýt?
4. Bạn cần biết thông tin nào trước khi rời nhà?
5. Bạn có sẵn sàng đi xe buýt nếu ứng dụng chứng minh tổng thời gian chỉ chậm hơn xe máy 10 phút nhưng tiết kiệm được chi phí không?
6. Điều gì khiến bạn không tin DanaBus?

Nếu người thường đi xe máy vẫn không muốn chuyển dù có ETA chính xác, thì vấn đề không còn là thông tin. Khi đó cần giải quyết các yếu tố như điểm đầu cuối, gửi xe, tần suất, giá vé hoặc thời gian di chuyển.

## 25. Kết luận mới

Bạn không nên bỏ hoàn toàn ý tưởng xe buýt. Nhưng nên bỏ phiên bản hẹp:

> “Một app theo dõi vị trí xe buýt.”

Và chuyển sang phiên bản có giá trị chiến lược hơn:

> **Một trợ lý AI giúp sinh viên biết khi nào xe buýt thực sự là lựa chọn tốt hơn xe máy, sau đó giúp họ đi xe buýt với ít rủi ro và ít thời gian chờ hơn.**

Đây là cách giải quyết cả hai tầng vấn đề:

1. **Kích cầu:** Làm người dùng hiểu khi nào xe buýt đáng chọn.
2. **Giữ chân:** Khi đã chọn xe buýt, giúp họ không chờ nhầm hoặc trễ giờ.

Cách nhìn thay đổi hoàn toàn là:

> Không phải làm cho người dân yêu xe buýt bằng một bài tuyên truyền. Hãy tạo ra một hệ thống đủ trung thực và đủ thông minh để chỉ ra những thời điểm mà xe buýt thật sự thắng xe máy.

Đó mới là lý do thực tế để người dùng thay đổi hành vi.

## 26. Concept hoàn chỉnh kết hợp hai lớp AI

Không cần bỏ tính năng AI ban đầu. Tính năng dự đoán thời gian chờ vẫn nên là **lõi sản phẩm**. Điểm mới về kích cầu sẽ trở thành **lớp ra quyết định trước chuyến đi**.

### Cấu trúc sản phẩm hai tầng

#### Tầng 1: AI giúp người dùng quyết định có nên đi xe buýt không

Trước khi rời nhà, ứng dụng so sánh các lựa chọn dựa trên:

- Thời gian dự kiến từ nhà đến VKU.
- Thời gian đi bộ đến trạm.
- Thời gian chờ dự kiến.
- Thời gian di chuyển trên xe.
- Độ tin cậy của tuyến 6 và tuyến 13.
- Tình trạng giao thông.
- Thời tiết.
- Chi phí.
- Thời gian và sự bất tiện khi gửi xe máy tại trường.
- Giờ người dùng cần có mặt ở VKU.

AI có thể đưa ra kết luận:

> “Hôm nay xe buýt tuyến 13 là lựa chọn phù hợp hơn nếu bạn rời nhà trước 6:52. Tuyến 6 có thời gian dự báo ngắn hơn nhưng độ biến động cao hơn.”

Hoặc:

> “Trong tình huống hiện tại, xe máy nhanh hơn. Ứng dụng sẽ nhắc bạn thử tuyến 13 vào khung giờ khác khi độ tin cậy cao hơn.”

#### Tầng 2: AI giúp người dùng đi xe buýt với ít thời gian chờ hơn

Sau khi người dùng chọn xe buýt, hệ thống sử dụng các chức năng AI ban đầu:

- Dự đoán thời gian xe đến trạm.
- Dự đoán khoảng thời gian chờ, ví dụ 8–12 phút.
- Hiển thị mức độ tin cậy của dự báo.
- So sánh thời gian đến của tuyến 6 và tuyến 13.
- Phát hiện xe đang trễ, dừng quá lâu hoặc mất tín hiệu.
- Xác định xe đã đi qua trạm hay chưa.
- Cảnh báo khi người dùng nên tiếp tục chờ hoặc chuyển sang phương án khác.
- Gợi ý thời điểm rời nhà để giảm thời gian chờ.

Như vậy, sản phẩm có một hành trình tự nhiên:

> **Quyết định chọn xe buýt → Chọn tuyến tốt hơn → Rời nhà đúng lúc → Theo dõi thời gian chờ → Được cảnh báo khi có bất thường.**

### AI không bị chia thành hai sản phẩm khác nhau

Hai lớp AI dùng chung một nền dữ liệu:

- GPS của xe buýt.
- Tín hiệu cảm biến tại các trạm thử nghiệm.
- Lịch sử thời gian xe đến và rời trạm.
- Dữ liệu giao thông.
- Thời tiết.
- Lịch học hoặc giờ cần có mặt của người dùng.
- Lịch sử lựa chọn và kết quả thực tế của người dùng.

AI có thể học từ chênh lệch giữa dự báo và thực tế. Ví dụ, nếu tuyến 13 thường trễ 10 phút vào thứ Hai lúc 7:00, hệ thống sẽ điều chỉnh dự báo và mức độ tin cậy cho các chuyến sau.

### Sơ đồ hoạt động đề xuất

```text
Người dùng nhập điểm đến và giờ cần có mặt
                    ↓
AI so sánh xe buýt với phương án cá nhân
                    ↓
Nếu chọn xe buýt: so sánh tuyến 6 và tuyến 13
                    ↓
AI dự đoán ETA, thời gian chờ và độ tin cậy
                    ↓
GPS + cảm biến xác nhận trạng thái xe tại trạm
                    ↓
AI cảnh báo và đề xuất hành động tiếp theo
```

### Vai trò của cảm biến trong concept cuối

Cảm biến không phải là tính năng người dùng nhìn thấy trực tiếp. Nó là lớp giúp dữ liệu đáng tin hơn:

- GPS cho biết xe đang di chuyển ở đâu.
- Cảm biến giúp xác nhận xe đã thực sự đi qua trạm.
- AI đối chiếu hai nguồn dữ liệu.
- Hệ thống hiển thị mức độ tin cậy thay vì giả vờ chính xác tuyệt đối.

Trong MVP, chỉ cần mô phỏng cảm biến hoặc thử nghiệm tại một số trạm gần VKU. Không nên đề xuất lắp đặt cảm biến trên toàn bộ thành phố ngay từ đầu.

### Problem statement hoàn chỉnh

> Sinh viên VKU thường phải lựa chọn giữa xe máy và các tuyến xe buýt 6, 13 nhưng không biết phương án nào phù hợp nhất với thời gian cần đến trường. Khi đã chọn xe buýt, họ vẫn phải chờ trong trạng thái không chắc chắn vì thời gian xe đến có thể thay đổi. Ứng dụng dùng AI để giúp họ quyết định khi nào xe buýt đáng chọn, tuyến nào phù hợp hơn và nên chờ bao lâu để giảm thời gian chờ và nguy cơ trễ giờ.

### One-liner cho bài thi

> **An AI commute assistant that helps VKU students decide when taking the bus is worth it, then predicts and manages their waiting time on routes 6 and 13.**

### Tagline đề xuất

> **Choose smarter. Wait less. Arrive on time.**

### Cách giải thích ngắn gọn với ban giám khảo

> “Our solution has two layers. First, AI helps students decide whether taking the bus is the best option for a specific trip. Second, once they choose the bus, AI predicts the actual waiting time, compares routes 6 and 13, detects delays and recommends the next action. This means we are not only helping existing bus users wait better; we are also making public transport a more confident choice.”

### Đánh giá cuối cùng

Giữ lại AI dự đoán thời gian chờ giúp dự án bám sát pain point ban đầu của bạn. Bổ sung AI lựa chọn phương tiện giúp dự án giải quyết câu hỏi lớn hơn về khả năng kích cầu.

Vì vậy, concept cuối không phải là:

> “Một app theo dõi xe buýt.”

Mà là:

> **Một trợ lý AI giúp sinh viên quyết định, lựa chọn và sử dụng xe buýt một cách đáng tin cậy hơn.**

## 27. Nội dung điền form dự thi

### Tên đội

**NexMile**

### Tên ý tưởng và tagline

**WaitWise – Choose smarter. Wait less. Arrive on time.**

### Mô tả ngắn ý tưởng bằng tiếng Anh

**WaitWise is an AI-powered commute assistant designed for VKU students who travel to campus by bus routes 6 and 13. Before leaving home, the app compares bus and personal-vehicle options based on door-to-door travel time, cost, traffic, weather, parking difficulty and the student’s arrival deadline. It recommends whether taking the bus is worthwhile and, if so, which route and departure time are more suitable. During the journey, AI predicts bus arrival and waiting-time ranges, estimates confidence, detects abnormal delays or outdated location signals, and alerts users whether to keep waiting, switch routes or use a backup option. The system combines bus GPS, historical travel patterns, traffic and weather data, and optional low-power stop sensors that help verify when a bus passes a stop. WaitWise benefits students by reducing unnecessary waiting, missed buses and late arrivals, while making public transport a more reliable and confident choice.**

### Bản mô tả ngắn hơn nếu biểu mẫu giới hạn ký tự

**WaitWise is an AI commute assistant for VKU students using bus routes 6 and 13. It first helps users decide whether taking the bus is the best option for a specific trip. Once they choose the bus, AI predicts arrival and waiting times, compares routes, estimates confidence, detects delays and recommends the next action. The system uses GPS, historical travel data, traffic, weather and optional stop sensors. It helps students wait less, avoid missed buses and arrive on time.**

### AI được sử dụng như thế nào

- **Commute choice:** compares bus and personal-vehicle options for a specific trip.
- **ETA and waiting-time prediction:** estimates when route 6 or 13 will arrive at the user’s stop.
- **Confidence estimation:** shows how reliable each prediction is.
- **Anomaly detection:** identifies unusual delays, long stops or outdated GPS signals.
- **Personalized recommendations:** suggests when to leave home, which route to choose and whether to continue waiting or switch plans.
- **Sensor and GPS fusion:** combines GPS with optional stop sensors to verify that a bus has passed a stop.

### Đối tượng được hưởng lợi

- Primary users: VKU students who depend on or are considering public buses.
- Direct benefits: less unnecessary waiting, fewer missed buses, lower risk of being late and clearer route decisions.
- Wider benefits: greater confidence in public transport and a potential increase in public-bus usage among students.

### Link nộp bài

Dán link Google Drive của file PDF vào trường này sau khi bật:

**General access → Anyone with the link → Viewer**

Mẫu điền:

`[PASTE YOUR GOOGLE DRIVE PDF LINK HERE]`

Nếu có prototype hoặc video demo, có thể thêm link thứ hai. Nếu chưa có thì để trống vì phần MVP/demo là không bắt buộc.
