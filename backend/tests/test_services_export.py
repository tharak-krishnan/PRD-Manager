import pytest
from io import BytesIO
from app.services.export_service import RoadmapExporter, PRDExporter
from openpyxl import load_workbook
from pptx import Presentation
from docx import Document


@pytest.mark.unit
class TestRoadmapExporter:
    """Unit tests for RoadmapExporter service"""

    def test_roadmap_exporter_initialization(self, client, multiple_categories):
        """Test RoadmapExporter initialization"""
        exporter = RoadmapExporter(multiple_categories)

        assert exporter.categories == multiple_categories
        assert len(exporter.color_map) == 10
        assert len(exporter.text_color_map) == 10
        assert len(exporter.color_names) == 10

    def test_get_features_with_dates(self, client, category_with_features):
        """Test extracting features with release dates"""
        category, features = category_with_features
        exporter = RoadmapExporter([category])

        features_with_dates = exporter._get_features_with_dates()

        assert len(features_with_dates) > 0
        assert all(f['release_date'] is not None for f in features_with_dates)
        assert all('category_name' in f for f in features_with_dates)

    def test_generate_month_range(self, client, category_with_features):
        """Test generating month range from features"""
        category, features = category_with_features
        exporter = RoadmapExporter([category])

        features_with_dates = exporter._get_features_with_dates()
        months = exporter._generate_month_range(features_with_dates)

        assert len(months) > 0
        assert all('-' in month for month in months)  # Format: YYYY-MM

    def test_generate_pptx(self, client, category_with_features):
        """Test generating PowerPoint presentation"""
        category, features = category_with_features
        exporter = RoadmapExporter([category])

        pptx_buffer = exporter.generate_pptx()

        assert isinstance(pptx_buffer, BytesIO)
        pptx_buffer.seek(0)

        # Verify it's a valid presentation
        prs = Presentation(pptx_buffer)
        assert len(prs.slides) >= 1

    def test_chunk_timeline(self, client):
        """Test chunking timeline into 6-month segments"""
        from app.services.export_service import RoadmapExporter

        months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
                  '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']

        exporter = RoadmapExporter([])
        chunks = list(exporter._chunk_timeline(months, chunk_size=6))

        assert len(chunks) == 2
        assert len(chunks[0]) == 6
        assert len(chunks[1]) == 6


@pytest.mark.unit
class TestPRDExporter:
    """Unit tests for PRDExporter service"""

    def test_prd_exporter_initialization(self, client, multiple_categories):
        """Test PRDExporter initialization"""
        exporter = PRDExporter(multiple_categories)

        assert exporter.categories == multiple_categories

    def test_generate_excel(self, client, category_with_features):
        """Test generating Excel workbook"""
        category, features = category_with_features
        exporter = PRDExporter([category])

        excel_buffer = exporter.generate_excel()

        assert isinstance(excel_buffer, BytesIO)
        excel_buffer.seek(0)

        # Verify it's a valid workbook
        wb = load_workbook(excel_buffer)
        assert 'PRD Summary' in wb.sheetnames
        assert category.name in wb.sheetnames

    def test_generate_word(self, client, category_with_features):
        """Test generating Word document"""
        category, features = category_with_features
        exporter = PRDExporter([category])

        word_buffer = exporter.generate_word()

        assert isinstance(word_buffer, BytesIO)
        word_buffer.seek(0)

        # Verify it's a valid document
        doc = Document(word_buffer)
        assert len(doc.paragraphs) > 0
        # Should contain category name
        text_content = ' '.join([p.text for p in doc.paragraphs])
        assert category.name in text_content

    def test_excel_has_correct_structure(self, client, category_with_features):
        """Test Excel file has correct structure"""
        category, features = category_with_features
        exporter = PRDExporter([category])

        excel_buffer = exporter.generate_excel()
        excel_buffer.seek(0)

        wb = load_workbook(excel_buffer)
        summary_sheet = wb['PRD Summary']

        # Check summary sheet has headers
        assert summary_sheet.cell(1, 1).value == 'Product Requirements Document (PRD)'

        # Check category sheet has correct headers
        category_sheet = wb[category.name]
        expected_headers = ['ID', 'Title', 'Priority', 'Description', 'KPI',
                            'Customer', 'Eng. Comment',
                            'Signoff', 'Complexity', 'Release Date']

        for col, expected_header in enumerate(expected_headers, start=1):
            assert category_sheet.cell(4, col).value == expected_header

    def test_word_has_table_of_contents(self, client, category_with_features):
        """Test Word document has table of contents"""
        category, features = category_with_features
        exporter = PRDExporter([category])

        word_buffer = exporter.generate_word()
        word_buffer.seek(0)

        doc = Document(word_buffer)
        text_content = ' '.join([p.text for p in doc.paragraphs])

        # Should contain "Table of Contents"
        assert 'Table of Contents' in text_content

    def test_excel_empty_categories(self, client):
        """Test generating Excel with empty categories"""
        from app.models import Category

        empty_category = Category(id='cat-empty', name='Empty Category', description='No features')
        exporter = PRDExporter([empty_category])

        excel_buffer = exporter.generate_excel()
        excel_buffer.seek(0)

        wb = load_workbook(excel_buffer)
        # Empty categories should not have their own sheet, only PRD Summary
        assert 'PRD Summary' in wb.sheetnames
        assert 'Empty Category' not in wb.sheetnames
