import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '../testUtils';
import userEvent from '@testing-library/user-event';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  afterEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    expect(screen.getByText('Showing 1 to 10 of 50 items')).toBeInTheDocument();
  });

  it('displays correct page numbers', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );

    expect(screen.getByText('3')).toHaveClass('bg-blue-600');
  });

  it('calls onPageChange when clicking next button', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1]; // Last button is next
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous button', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    const prevButton = screen.getAllByRole('button')[0]; // First button is prev
    await user.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    const prevButton = screen.getAllByRole('button')[0];
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={10}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={200}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('calls onPageChange when clicking page number', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    const page3Button = screen.getByText('3');
    await user.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});
