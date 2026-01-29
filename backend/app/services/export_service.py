from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from io import BytesIO
from datetime import datetime


class RoadmapExporter:
    """Service for exporting roadmap to PowerPoint"""

    def __init__(self, categories):
        self.categories = categories

        # Color mapping from Tailwind to PowerPoint RGB
        # Maps to the exact Tailwind -700 colors used in the frontend
        # Frontend uses: bg-{color}-900/30 border-{color}-700/50 text-{color}-400
        self.color_map = {
            "blue": RGBColor(29, 78, 216),  # blue-700
            "green": RGBColor(21, 128, 61),  # green-700
            "purple": RGBColor(126, 34, 206),  # purple-700
            "yellow": RGBColor(161, 98, 7),  # yellow-700
            "pink": RGBColor(190, 24, 93),  # pink-700
            "indigo": RGBColor(67, 56, 202),  # indigo-700
            "red": RGBColor(185, 28, 28),  # red-700
            "orange": RGBColor(194, 65, 12),  # orange-700
            "teal": RGBColor(15, 118, 110),  # teal-700
            "cyan": RGBColor(14, 116, 144),  # cyan-700
        }

        # Text colors (Tailwind -400 variants)
        self.text_color_map = {
            "blue": RGBColor(96, 165, 250),  # blue-400
            "green": RGBColor(74, 222, 128),  # green-400
            "purple": RGBColor(192, 132, 252),  # purple-400
            "yellow": RGBColor(250, 204, 21),  # yellow-400
            "pink": RGBColor(244, 114, 182),  # pink-400
            "indigo": RGBColor(129, 140, 248),  # indigo-400
            "red": RGBColor(248, 113, 113),  # red-400
            "orange": RGBColor(251, 146, 60),  # orange-400
            "teal": RGBColor(45, 212, 191),  # teal-400
            "cyan": RGBColor(34, 211, 238),  # cyan-400
        }

        self.color_names = [
            "blue",
            "green",
            "purple",
            "yellow",
            "pink",
            "indigo",
            "red",
            "orange",
            "teal",
            "cyan",
        ]

        # Priority colors
        self.priority_colors = {
            "High": RGBColor(220, 38, 38),  # Red
            "Medium": RGBColor(234, 179, 8),  # Yellow
            "Low": RGBColor(34, 197, 94),  # Green
        }

    def generate_pptx(self):
        """Generate PowerPoint presentation and return as BytesIO buffer"""
        # Create presentation with 16:9 widescreen
        prs = Presentation()
        prs.slide_width = Inches(13.33)
        prs.slide_height = Inches(7.5)

        # Get features with dates
        features_with_dates = self._get_features_with_dates()

        if not features_with_dates:
            raise ValueError("No features with release dates found")

        # Generate month range
        months = self._generate_month_range(features_with_dates)

        # Create title slide
        self._create_title_slide(prs, months)

        # Split timeline into 6-month chunks and create slides
        chunks = list(self._chunk_timeline(months, chunk_size=6))
        for i, months_chunk in enumerate(chunks):
            self._create_timeline_slide(
                prs, months_chunk, i, len(chunks), features_with_dates
            )

        # Save to BytesIO buffer
        buffer = BytesIO()
        prs.save(buffer)
        buffer.seek(0)
        return buffer

    def _create_title_slide(self, prs, months):
        """Create title slide with metadata"""
        # Use title slide layout
        slide = prs.slides.add_slide(prs.slide_layouts[0])

        # Set slide background to match web app (Tailwind gray-800: RGB(31, 41, 55))
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = RGBColor(31, 41, 55)

        title = slide.shapes.title
        subtitle = slide.placeholders[1]

        title.text = "Product Roadmap"

        # Style title text
        title.text_frame.paragraphs[0].font.color.rgb = RGBColor(
            243, 244, 246
        )  # gray-100

        # Format dates for subtitle
        start_month = self._format_month_long(months[0])
        end_month = self._format_month_long(months[-1])

        subtitle.text = f"{start_month} - {end_month}\nGenerated: {datetime.now().strftime('%B %d, %Y')}"

        # Style subtitle text
        for paragraph in subtitle.text_frame.paragraphs:
            paragraph.font.color.rgb = RGBColor(209, 213, 219)  # gray-300

    def _create_timeline_slide(
        self, prs, months_chunk, chunk_index, total_chunks, features_with_dates
    ):
        """Create a timeline slide for a chunk of months"""
        # Use blank slide layout
        slide = prs.slides.add_slide(prs.slide_layouts[6])

        # Set slide background to match web app (Tailwind gray-800: RGB(31, 41, 55))
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = RGBColor(31, 41, 55)

        # Add title
        title_left = Inches(0.5)
        title_top = Inches(0.3)
        title_width = Inches(12.33)
        title_height = Inches(0.6)

        title_box = slide.shapes.add_textbox(
            title_left, title_top, title_width, title_height
        )
        title_frame = title_box.text_frame
        title_para = title_frame.paragraphs[0]

        start_month = self._format_month_long(months_chunk[0])
        end_month = self._format_month_long(months_chunk[-1])
        title_text = f"Product Roadmap: {start_month} - {end_month}"

        if total_chunks > 1:
            title_text += f" (Slide {chunk_index + 1} of {total_chunks})"

        title_para.text = title_text
        title_para.font.size = Pt(20)
        title_para.font.bold = True
        title_para.font.color.rgb = RGBColor(255, 255, 255)

        # Calculate dimensions
        category_col_width = Inches(1.8)
        timeline_start_left = Inches(0.5) + category_col_width
        timeline_width = Inches(12.33) - category_col_width
        month_width = timeline_width / len(months_chunk)

        header_top = Inches(1.1)
        header_height = Inches(0.4)

        # Draw month headers
        for i, month in enumerate(months_chunk):
            month_left = timeline_start_left + (i * month_width)

            month_box = slide.shapes.add_textbox(
                month_left, header_top, month_width, header_height
            )
            month_frame = month_box.text_frame
            month_para = month_frame.paragraphs[0]
            month_para.text = self._format_month_short(month)
            month_para.font.size = Pt(11)
            month_para.font.bold = True
            month_para.font.color.rgb = RGBColor(200, 200, 200)
            month_para.alignment = PP_ALIGN.CENTER

        # Get categories with features in this timeline
        categories_with_features = []
        for cat in self.categories:
            cat_features = [
                f
                for f in features_with_dates
                if f["category_id"] == cat.id and f["release_date"] in months_chunk
            ]
            if cat_features or any(
                f["category_id"] == cat.id for f in features_with_dates
            ):
                categories_with_features.append(cat)

        # Draw category rows and features
        row_height = Inches(0.9)
        content_top = header_top + header_height + Inches(0.1)

        for cat_index, category in enumerate(categories_with_features):
            row_top = content_top + (cat_index * row_height)

            # Category name
            cat_box = slide.shapes.add_textbox(
                Inches(0.5), row_top, category_col_width - Inches(0.1), row_height
            )
            cat_frame = cat_box.text_frame
            cat_frame.word_wrap = True
            cat_para = cat_frame.paragraphs[0]
            cat_para.text = category.name
            cat_para.font.size = Pt(10)
            cat_para.font.bold = True
            cat_para.font.color.rgb = RGBColor(200, 200, 200)

            # Get color for this category
            color_name = self.color_names[cat_index % len(self.color_names)]
            fill_color = self.color_map[color_name]
            text_color = self.text_color_map[color_name]

            # Draw features for each month
            for month_index, month in enumerate(months_chunk):
                month_features = [
                    f
                    for f in features_with_dates
                    if f["category_id"] == category.id and f["release_date"] == month
                ]

                month_left = timeline_start_left + (month_index * month_width)

                # Stack features vertically if multiple in same month
                feature_height = (
                    Inches(0.65) if len(month_features) <= 1 else Inches(0.4)
                )
                feature_spacing = Inches(0.05)

                for feat_index, feature in enumerate(
                    month_features[:3]
                ):  # Max 3 features per cell
                    feature_top = (
                        row_top
                        + Inches(0.1)
                        + (feat_index * (feature_height + feature_spacing))
                    )

                    self._add_feature_card(
                        slide,
                        feature,
                        month_left + Inches(0.05),
                        feature_top,
                        month_width - Inches(0.1),
                        feature_height,
                        fill_color,
                        text_color,
                    )

    def _add_feature_card(
        self, slide, feature, left, top, width, height, fill_color, text_color
    ):
        """Add a feature card to the slide"""
        # Add rounded rectangle
        shape = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height
        )

        # Set fill color with transparency to match web (bg-{color}-900/30)
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
        shape.fill.transparency = 0.5  # 50% transparency to match web appearance

        # Set border color (border-{color}-700/50)
        shape.line.color.rgb = fill_color
        shape.line.width = Pt(1.5)
        shape.line.transparency = 0.3

        # Add text
        text_frame = shape.text_frame
        text_frame.word_wrap = True
        text_frame.margin_left = Pt(4)
        text_frame.margin_right = Pt(4)
        text_frame.margin_top = Pt(3)
        text_frame.margin_bottom = Pt(3)

        # Clear default paragraph
        text_frame.clear()

        # Title (bold) - use text_color to match web (text-{color}-400)
        p_title = text_frame.paragraphs[0]
        p_title.text = feature["title"][:30] + (
            "..." if len(feature["title"]) > 30 else ""
        )
        p_title.font.size = Pt(9)
        p_title.font.bold = True
        p_title.font.color.rgb = text_color

        # ID (small, gray)
        p_id = text_frame.add_paragraph()
        p_id.text = feature["id"]
        p_id.font.size = Pt(7)
        p_id.font.color.rgb = RGBColor(180, 180, 180)

        # Priority and Complexity
        p_meta = text_frame.add_paragraph()
        priority_letter = feature["priority"][0]  # H, M, or L
        complexity = feature["engineering_complexity"]
        p_meta.text = f"{priority_letter} • {complexity}"
        p_meta.font.size = Pt(7)
        p_meta.font.bold = True

        # Color code priority
        priority_color = self.priority_colors.get(
            feature["priority"], RGBColor(200, 200, 200)
        )
        p_meta.font.color.rgb = priority_color

    def _get_features_with_dates(self):
        """Extract all features with release dates and category info"""
        features = []
        for category in self.categories:
            for feature in category.features:
                if feature.release_date:
                    features.append(
                        {
                            "id": feature.id,
                            "title": feature.title,
                            "priority": feature.priority.value,
                            "engineering_complexity": feature.engineering_complexity.value,
                            "release_date": feature.release_date,
                            "category_id": category.id,
                            "category_name": category.name,
                        }
                    )
        return features

    def _generate_month_range(self, features):
        """Generate month range from earliest to latest + 2 months"""
        if not features:
            return []

        dates = [f["release_date"] for f in features]
        dates.sort()

        # Parse start and end dates
        start_year, start_month = map(int, dates[0].split("-"))
        end_year, end_month = map(int, dates[-1].split("-"))

        # Add 2 months to end date
        end_month += 2
        if end_month > 12:
            end_month -= 12
            end_year += 1

        # Generate all months between start and end
        months = []
        current_year, current_month = start_year, start_month

        while (current_year < end_year) or (
            current_year == end_year and current_month <= end_month
        ):
            months.append(f"{current_year}-{current_month:02d}")
            current_month += 1
            if current_month > 12:
                current_month = 1
                current_year += 1

        return months

    def _chunk_timeline(self, months, chunk_size=6):
        """Split timeline into chunks for multiple slides"""
        for i in range(0, len(months), chunk_size):
            yield months[i : i + chunk_size]

    def _format_month_short(self, month_str):
        """Format YYYY-MM to 'Mon YY' (e.g., 'Jan 24')"""
        year, month = month_str.split("-")
        date = datetime(int(year), int(month), 1)
        return date.strftime("%b %y")

    def _format_month_long(self, month_str):
        """Format YYYY-MM to 'Month YYYY' (e.g., 'January 2024')"""
        year, month = month_str.split("-")
        date = datetime(int(year), int(month), 1)
        return date.strftime("%B %Y")


class PRDExporter:
    """Service for exporting PRD (all categories and features) to Excel and Word"""

    def __init__(self, categories):
        self.categories = categories

    def generate_excel(self):
        """Generate Excel file with all categories and features"""
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

        wb = Workbook()
        wb.remove(wb.active)  # Remove default sheet

        # Create summary sheet
        summary_sheet = wb.create_sheet("PRD Summary")
        self._create_summary_sheet(summary_sheet)

        # Create a sheet for each category
        for category in self.categories:
            if category.features:
                sheet = wb.create_sheet(self._sanitize_sheet_name(category.name))
                self._create_category_sheet(sheet, category)

        # Save to BytesIO buffer
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return buffer

    def _sanitize_sheet_name(self, name):
        """Sanitize sheet name to meet Excel requirements"""
        # Excel sheet names can't be longer than 31 chars and can't contain: \ / ? * [ ]
        invalid_chars = ["\\", "/", "?", "*", "[", "]"]
        sanitized = name
        for char in invalid_chars:
            sanitized = sanitized.replace(char, "")
        return sanitized[:31]

    def _create_summary_sheet(self, sheet):
        """Create summary sheet with overview of all categories"""
        from openpyxl.styles import Font, PatternFill, Alignment

        # Title
        sheet["A1"] = "Product Requirements Document (PRD)"
        sheet["A1"].font = Font(size=16, bold=True)
        sheet["A2"] = f'Generated: {datetime.now().strftime("%B %d, %Y at %I:%M %p")}'
        sheet["A2"].font = Font(size=10, italic=True)

        # Headers
        headers = [
            "Category",
            "Description",
            "Total Features",
            "High Priority",
            "Medium Priority",
            "Low Priority",
        ]
        for col, header in enumerate(headers, start=1):
            cell = sheet.cell(row=4, column=col, value=header)
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill(
                start_color="366092", end_color="366092", fill_type="solid"
            )
            cell.alignment = Alignment(horizontal="center", vertical="center")

        # Data rows
        row = 5
        for category in self.categories:
            features = category.features
            high_count = sum(1 for f in features if f.priority.value == "High")
            medium_count = sum(1 for f in features if f.priority.value == "Medium")
            low_count = sum(1 for f in features if f.priority.value == "Low")

            sheet.cell(row=row, column=1, value=category.name)
            sheet.cell(row=row, column=2, value=category.description)
            sheet.cell(row=row, column=3, value=len(features))
            sheet.cell(row=row, column=4, value=high_count)
            sheet.cell(row=row, column=5, value=medium_count)
            sheet.cell(row=row, column=6, value=low_count)
            row += 1

        # Auto-adjust column widths
        for col in range(1, 7):
            sheet.column_dimensions[chr(64 + col)].width = 20

    def _create_category_sheet(self, sheet, category):
        """Create a sheet for a specific category with all its features"""
        from openpyxl.styles import Font, PatternFill, Alignment

        # Category header
        sheet["A1"] = category.name
        sheet["A1"].font = Font(size=14, bold=True)
        sheet["A2"] = category.description
        sheet["A2"].font = Font(size=10, italic=True)
        sheet.merge_cells("A2:K2")

        # Column headers
        headers = [
            "ID",
            "Title",
            "Priority",
            "Description",
            "KPI",
            "Customer",
            "Eng. Comment",
            "Signoff",
            "Complexity",
            "Release Date",
        ]
        for col, header in enumerate(headers, start=1):
            cell = sheet.cell(row=4, column=col, value=header)
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill(
                start_color="366092", end_color="366092", fill_type="solid"
            )
            cell.alignment = Alignment(
                horizontal="center", vertical="center", wrap_text=True
            )

        # Feature rows
        row = 5
        for feature in category.features:
            sheet.cell(row=row, column=1, value=feature.id)
            sheet.cell(row=row, column=2, value=feature.title)
            sheet.cell(row=row, column=3, value=feature.priority.value)
            sheet.cell(row=row, column=4, value=feature.description)
            sheet.cell(row=row, column=5, value=feature.kpi)
            sheet.cell(row=row, column=6, value=feature.customer_name)
            sheet.cell(row=row, column=7, value=feature.engineering_comment)
            sheet.cell(
                row=row, column=8, value="Yes" if feature.engineering_signoff else "No"
            )
            sheet.cell(row=row, column=9, value=feature.engineering_complexity.value)

            # Format release date
            if feature.release_date:
                try:
                    year, month = feature.release_date.split("-")
                    release_date_obj = datetime(int(year), int(month), 1)
                    sheet.cell(
                        row=row, column=10, value=release_date_obj.strftime("%B %Y")
                    )
                except (ValueError, TypeError, AttributeError):
                    sheet.cell(row=row, column=10, value=feature.release_date)
            else:
                sheet.cell(row=row, column=10, value="")

            # Apply text wrapping to description and comment columns
            sheet.cell(row=row, column=4).alignment = Alignment(
                wrap_text=True, vertical="top"
            )
            sheet.cell(row=row, column=7).alignment = Alignment(
                wrap_text=True, vertical="top"
            )

            row += 1

        # Auto-adjust column widths
        column_widths = [10, 30, 12, 40, 30, 20, 30, 10, 12, 15]
        for col, width in enumerate(column_widths, start=1):
            sheet.column_dimensions[chr(64 + col)].width = width

    def generate_word(self):
        """Generate Word document with all categories and features"""
        from docx import Document
        from docx.shared import Inches, Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH

        doc = Document()

        # Title
        title = doc.add_heading("Product Requirements Document (PRD)", 0)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER

        # Metadata
        metadata = doc.add_paragraph(
            f'Generated: {datetime.now().strftime("%B %d, %Y at %I:%M %p")}'
        )
        metadata.alignment = WD_ALIGN_PARAGRAPH.CENTER
        metadata.runs[0].italic = True

        doc.add_paragraph()  # Spacing

        # Table of Contents
        doc.add_heading("Table of Contents", 1)
        for idx, category in enumerate(self.categories, start=1):
            toc_para = doc.add_paragraph(f"{idx}. {category.name}", style="List Number")

        doc.add_page_break()

        # Add each category
        for category in self.categories:
            self._add_category_to_doc(doc, category)
            doc.add_page_break()

        # Save to BytesIO buffer
        buffer = BytesIO()
        doc.save(buffer)
        buffer.seek(0)
        return buffer

    def _add_category_to_doc(self, doc, category):
        """Add a category section to the Word document"""
        from docx.shared import Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH

        # Category title
        heading = doc.add_heading(category.name, 1)

        # Category description
        if category.description:
            desc_para = doc.add_paragraph(category.description)
            desc_para.runs[0].italic = True
            doc.add_paragraph()  # Spacing

        # Features
        features = category.features
        if not features:
            doc.add_paragraph("No features in this category.")
            return

        doc.add_paragraph(f"Total Features: {len(features)}")
        doc.add_paragraph()  # Spacing

        # Add each feature
        for feature in features:
            # Feature title with ID
            feature_heading = doc.add_heading(f"{feature.id}: {feature.title}", 2)

            # Create a table for feature details
            table = doc.add_table(rows=9, cols=2)
            table.style = "Light Grid Accent 1"

            # Add feature details
            details = [
                ("Priority", feature.priority.value),
                ("Description", feature.description or "-"),
                ("KPI", feature.kpi or "-"),
                ("Customer", feature.customer_name or "-"),
                ("Engineering Comment", feature.engineering_comment or "-"),
                ("Engineering Signoff", "Yes" if feature.engineering_signoff else "No"),
                ("Complexity", feature.engineering_complexity.value),
                (
                    "Release Date",
                    (
                        self._format_release_date(feature.release_date)
                        if feature.release_date
                        else "-"
                    ),
                ),
            ]

            for idx, (label, value) in enumerate(details):
                table.rows[idx].cells[0].text = label
                table.rows[idx].cells[0].paragraphs[0].runs[0].bold = True
                table.rows[idx].cells[1].text = str(value)

            doc.add_paragraph()  # Spacing between features

    def _format_release_date(self, date_str):
        """Format YYYY-MM to readable format"""
        try:
            year, month = date_str.split("-")
            date_obj = datetime(int(year), int(month), 1)
            return date_obj.strftime("%B %Y")
        except (ValueError, TypeError, AttributeError):
            return date_str
